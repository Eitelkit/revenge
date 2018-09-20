var LeapController = function (player) {
    this.player = player;
    // creates a new Leap Controller object
    this.controller = new Leap.Controller({enableGestures: true});
    // connect the controller with the web socket
    this.controller.connect();
}

LeapController.prototype = {
    constructor: LeapController,
    update: function () {
        var player = this.player;
        var leapToScene = this.leapToScene;
        this.controller.on('frame', function (frame) {
            // loop through the hands array returned from 'frame'
            for (var i = 0; i < frame.hands.length; i++) {
                // for each hand:
                var hand = frame.hands[i];
                // get the hand position in canvas coordination by using leapToScene function
                var handPos = leapToScene(frame, hand.palmPosition, w, h);

                // update new gundam's position according to the position of the player's hand
                player.sprite.x = handPos[0];
                player.sprite.y = handPos[1];
            }

            //loop through the recognized gestures sent via frame

            if (frame.valid && frame.gestures.length > 0) {
                frame.gestures.forEach(function (gesture) {
                    switch (gesture.type) {
                        case "circle":
                            // if the gesture is 'circle', let the player fire super bullets
                            player.fire();
                            break;
                    }
                });
            }


        });
    },
    leapToScene: function (frame, leapPos, gameDivWidth, gameDivHeight) {
        // Gets the interaction box of the current frame
        // Gets the left border and top border of the box
        // In order to convert the position to the proper
        // location for the canvas
        var left = frame.interactionBox.center[0] - frame.interactionBox.size[0] / 2;
        var top = frame.interactionBox.center[1] + frame.interactionBox.size[1] / 2;
        // Takes our leap coordinates, and changes them so
        // that the origin is in the top left corner
        var x = leapPos[0] - left;
        var y = leapPos[1] - top;
        // Divides the position by the size of the box
        // so that x and y values will range from 0 to 1
        // as they lay within the interaction box
        x /= frame.interactionBox.size[0];
        y /= frame.interactionBox.size[1];
        // Uses the height and width of the canvas to scale
        // the x and y coordinates in a way that they
        // take up the entire canvas
        x *= gameDivWidth;
        y *= gameDivHeight;
        // Returns the values, making sure to negate the sign
        // of the y coordinate, because the y basis in canvas
        // points down instead of up
        return [x, -y];
    }
}