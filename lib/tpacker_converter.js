#!/usr/bin/env node

/**
 * Command line tool to convert TexturePacker JSON-Array data into
 * optimized SpriteAnim.js JSON data file.
 * @author Miller Medeiros
 * @version 0.1.1 (2011/10/18)
 */



var program = require('commander'),
    fs = require('fs'),
    path = require('path');


// ---


function list(val){
    return val.split(',');
}


program
    .version('0.1.0')
    .description('Convert TexturePacker JSON-Array data into SpriteAnim.js data file.')
    .option('-i, --input <dir>', 'Specify input dir.')
    .option('-o, --output <dir>', 'Specify output dir.')
    .option('-f, --files [files]', 'Specify input json files (comma separated), if empty it will optimize all the ".json" files inside the input dir.', list)
    .option('-H, --hard', 'Overwrite existing files.')
    .option('-p, --image-path <path>', 'Base image path.')
    .parse(process.argv);


//input and output are required
if(! program.input || ! program.output){
    console.log('\n Please provide input and output folders.\n');
    program.parse([process.argv[0], process.argv[1], '-h']);
    process.exit(1);
}


// ---


var inputFiles;

if(! path.existsSync(program.output) ){
    fs.mkdirSync(program.output, '0777');
}

if(program.files){
    inputFiles = program.files;
} else {
    inputFiles = fs.readdirSync(program.input);
    inputFiles = inputFiles.filter(function(fname){
        return (/\.json$/).test(fname);
    });
}

if(! inputFiles.length){
    console.log('\n  ERROR: no JSON files found inside input directory.\n');
    process.exit(1);
}

console.log('\n  Converting %s file%s... ', inputFiles.length, (inputFiles.length > 1)? 's' : '');
inputFiles.forEach(processFile);
console.log('');


// ---


function processFile(fname){
    var fpath = path.join(program.input, fname),
        content = fs.readFileSync(fpath, "utf-8"),
        sourceData = JSON.parse(content),
        outputData = {
            spriteSheet : path.join(program.imagePath, sourceData.meta.image),
            frameSize : sourceData.frames[0].sourceSize,
            frames : sourceData.frames.map(normalizeFrameData)
        };

    var outputPath = path.join(program.output, fname);

    if(program.hard || ! path.existsSync(outputPath)){
        fs.writeFileSync(outputPath, JSON.stringify(outputData), 'utf-8');
        console.log('   - '+ fpath +' -> '+outputPath);
    } else {
        console.log('\n  ERROR: "'+ outputPath +'" already exists, use \'--hard\' to overwrite existing files.\n');
        process.exit(1);
    }
}

function normalizeFrameData(data){
    return {
        x : data.frame.x,
        y : data.frame.y,
        w : data.frame.w,
        h : data.frame.h,
        t : data.spriteSourceSize.y,
        l : data.spriteSourceSize.x
    };
}
