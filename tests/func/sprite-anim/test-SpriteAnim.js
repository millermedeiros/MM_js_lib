define(['src/other/SpriteAnim', 'src/other/SpriteAnim2', 'json!./squares.json'], function (SpriteAnim, SpriteAnim2, data) {


    var sprite = new SpriteAnim({
        fps : 24,
        playMode : SpriteAnim.ALTERNATE,
        // startAt : 1,
        // endAt : 22,
        frames: data.frames,
        frameSize : data.frameSize,
        spriteSheet : data.spriteSheet,
        container : document.getElementById('anim-1')
    });

    sprite.play();


    var sprite2 = new SpriteAnim2({
        fps : 24,
        playMode : SpriteAnim.ALTERNATE,
        // startAt : 1,
        // endAt : 22,
        frameSize : {
            w : 100,
            h : 150
        },
        frameCount : 24,
        nCols : 5,
        spriteSheet : 'squares-fix_size.png',
        container : document.getElementById('anim-2')
    });

    sprite2.play();


    // setTimeout(function () {
        // sprite2.stop()
    // }, 1500);


});
