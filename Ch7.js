
var plan = ["############################",
            "#      #    #      o      ##",
            "#                          #",
            "#          #####           #",
            "##         #   #    ##     #",
            "###           ##     #     #",
            "#           ###      #     #",
            "#   ####                   #",
            "#   ##       o             #",
            "# o  #         o       ### #",
            "#    #                     #",
            "############################"];

var Square = function(x, y){
  this.x = x;
  this.y = y;
};

Square.prototype.plus= function(other)
{
  return new Square( this.x + other.x, this.y + other.y);
};

var Grid = function( width, height ) {
  this.space = new Array( width * height );
  this.height = height;
  this.width = width;
};

Grid.prototype.contains = function( square ){
  return square.x >= 0 && square.x < this.width && 
    square.y >= 0 && square.y < this.height;
};

Grid.prototype.get = function( square ){
  return this.space[ this.width * square.x + square.y ];
};

Grid.prototype.set = function( square, value ){
  return this.space[ this.width * square.x + square.y ] = value;
};

Grid.prototype.forEach = function( f, context ){
  for( var y = 0; y < this.height; y++){
    for( var x = 0; x < this.width; x++){
      var value = this.space[ x + y * this.width ];
      if (value) {
        f.call( context, value, new Square(x, y));
      }
    }

  }
};


var directions = "n ne e se s sw w nw".split(" ");

var directionVectors = {
  "n":  new Square( 0, -1),
  "ne": new Square( 1, -1),
  "e":  new Square( 1,  0),
  "se": new Square( 1,  1),
  "s":  new Square( 0,  1),
  "sw": new Square(-1,  1),
  "w":  new Square(-1,  0),
  "nw": new Square(-1, -1)  
};

var randomElement = function(array) {
  return array[ Math.floor( Math.random() * array.length )];
};

var BouncingCritter = function( ) {
  this.direction = randomElement( directions );
};

BouncingCritter.prototype.act = function( view ) {
  if (view.look(this.direction) !== " "){
    this.direction = view.find(" ") || "s"
  }
  var ret_obj = {
    type: "move",
    direction: this.direction
  };
  return ret_obj;
};

var Wall = function() {};

var elementFromChar = function( legend, ch ) {
  if (ch === " ") return null;
  var element = new legend[ch]();
  element.origin = ch;
  return element;
};

var charFromElement = function( elt ) {
  if( !elt ) return " ";
  else return elt.origin;
};

var World = function( plan, legend ) {
  var grid = new Grid( plan[0].length, plan.length );
  
  plan.forEach( function( rowChars, rowIndex){
    for (var col = 0; col < rowChars.length; col++ ){
      grid.set( new Square(col, rowIndex), elementFromChar(legend, rowChars[col]));
    }
  });
  this.grid = grid;
  this.legend = legend;
};


World.prototype.toString = function() {
  var ret_str = "";
  for (var row = 0; row < this.grid.height; row++ ){
    for (var col = 0; col < this.grid.width; col++ ){
      ret_str += charFromElement( this.grid.get( new Square(col, row )));
    }
    ret_str+= "\n";
  }
  return ret_str;
};

var world = new World( plan, 
  {
    "#": Wall,
    "o": BouncingCritter
  }
);

console.log( world.toString() );
