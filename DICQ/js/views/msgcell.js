
//
//  Message Cell for Chat history (Table View)
//
!function (ns, tui, dimp) {
    'use strict';

    var Label = tui.Label;
    var Image = tui.Image;
    var TableViewCell = tui.TableViewCell;

    var Command = dimp.protocol.Command;
    var ImageContent = dimp.protocol.ImageContent;
    var MessageBuilder = dimp.cpu.MessageBuilder;
    var Facebook = dimp.Facebook;

    var MessageCell = function (cell) {
        TableViewCell.call(this, cell);
    };
    MessageCell.prototype = Object.create(TableViewCell.prototype);
    MessageCell.prototype.constructor = MessageCell;

    MessageCell.prototype.setMessage = function (iMsg) {
        // clear children
        this.removeChildren();

        var facebook = Facebook.getInstance();
        var user = facebook.getCurrentUser();
        var sender = facebook.getIdentifier(iMsg.envelope.sender);

        if (user.identifier.equals(sender)) {
            this.setClassName('sent');
        } else {
            this.setClassName('received');
        }

        // message time
        var time = iMsg.envelope.getTime();
        var timeView = new Label();
        timeView.setClassName('time');
        timeView.setText(time_string(time));
        this.appendChild(timeView);

        // name & number
        var name = facebook.getNickname(sender);
        if (!name) {
            name = sender.name;
        }
        var number = facebook.getNumberString(sender);
        var nameView = new Label();
        nameView.setClassName('name');
        nameView.setText(name + ' (' + number + ')');
        this.appendChild(nameView);

        // message content
        var content = iMsg.content;
        var contentView = null;

        if (content instanceof ImageContent) {
            contentView = image_content_view(content, sender);
        }
        if (!contentView) {
            contentView = text_content_view(content, sender);
        }

        contentView.setClassName('content');
        this.appendChild(contentView);

        return this;
    };

    var image_content_view = function (content, sender) {
        var image = new Image();
        var thumbnail = content.getValue("thumbnail");
        if (thumbnail && thumbnail.length > 0) {
            image.setSrc('data:image/png;base64,' + thumbnail);
        }
        return image;
    };

    var text_content_view = function (content, sender) {
        var textView = new Label();
        var text;
        if (content instanceof Command) {
            text = MessageBuilder.getCommandText(content, sender);
        } else {
            text = MessageBuilder.getContentText(content, sender);
        }
        textView.setText(text);
        return textView;
    };

    var time_string = function (time) {
        if (time instanceof Date) {
            var year = time.getFullYear();
            var month = time.getMonth() + 1;
            var date = time.getDate();
            var hours = time.getHours();
            var minutes = time.getMinutes();
            var seconds = time.getSeconds();

            if (month < 10) month = '0' + month;
            if (date < 10) date = '0' + date;
            if (hours < 10) hours = '0' + hours;
            if (minutes < 10) minutes = '0' + minutes;
            if (seconds < 10) seconds = '0' + seconds;

            var ts = year + '-' + month + '-' + date;
            ts += ' ' + hours + ':' + minutes + ':' + seconds;
            return ts;
        } else {
            return '';
        }
    };

    //-------- namespace --------
    ns.MessageCell = MessageCell;

}(dicq, tarsier.ui, DIMP);
