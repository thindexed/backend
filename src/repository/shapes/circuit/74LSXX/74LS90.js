// Generated Code for the Draw2D touch HTML5 lib.
// File will be generated if you save the *.shape file.
//
// created with http://www.draw2d.org
//
//
var circuit_74LSXX_74LS90 = CircuitFigure.extend({

   NAME: "circuit_74LSXX_74LS90",
   VERSION: "2.0.343_1136",

   init:function(attr, setter, getter)
   {
     var _this = this;

     this._super( $.extend({stroke:0, bgColor:null, width:62,height:163.7501000000002},attr), setter, getter);
     var port;
     // pin_ckb
     port = this.addPort(new DecoratedInputPort(), new draw2d.layout.locator.XYRelPortLocator({x: -1.6501612903231297, y: 11.258619078705706 }));
     port.setConnectionDirection(3);
     port.setBackgroundColor("#37B1DE");
     port.setName("pin_ckb");
     port.setMaxFanOut(20);
     // pin_r01
     port = this.addPort(new DecoratedInputPort(), new draw2d.layout.locator.XYRelPortLocator({x: -1.6501612903231297, y: 23.472352077952714 }));
     port.setConnectionDirection(3);
     port.setBackgroundColor("#37B1DE");
     port.setName("pin_r01");
     port.setMaxFanOut(20);
     // pin_r02
     port = this.addPort(new DecoratedInputPort(), new draw2d.layout.locator.XYRelPortLocator({x: -1.6501612903231297, y: 36.16364203747093 }));
     port.setConnectionDirection(3);
     port.setBackgroundColor("#37B1DE");
     port.setName("pin_r02");
     port.setMaxFanOut(20);
     // pin_nc1
     port = this.createPort("hybrid", new draw2d.layout.locator.XYRelPortLocator({x: -1.6501612903231297, y: 48.854931996988036 }));
     port.setConnectionDirection(3);
     port.setBackgroundColor("#37B1DE");
     port.setName("pin_nc1");
     port.setMaxFanOut(20);
     // pin_vcc
     port = this.addPort(new DecoratedInputPort(), new draw2d.layout.locator.XYRelPortLocator({x: -1.6501612903231297, y: 60.434161566923756 }));
     port.setConnectionDirection(3);
     port.setBackgroundColor("#37B1DE");
     port.setName("pin_vcc");
     port.setMaxFanOut(20);
     // pin_r91
     port = this.addPort(new DecoratedInputPort(), new draw2d.layout.locator.XYRelPortLocator({x: -1.6501612903231297, y: 73.12545152644086 }));
     port.setConnectionDirection(3);
     port.setBackgroundColor("#37B1DE");
     port.setName("pin_r91");
     port.setMaxFanOut(20);
     // pin_r92
     port = this.addPort(new DecoratedInputPort(), new draw2d.layout.locator.XYRelPortLocator({x: -1.6501612903231297, y: 85.07536789290482 }));
     port.setConnectionDirection(3);
     port.setBackgroundColor("#37B1DE");
     port.setName("pin_r92");
     port.setMaxFanOut(20);
     // pin_qc
     port = this.addPort(new DecoratedOutputPort(), new draw2d.layout.locator.XYRelPortLocator({x: 101.66274193548345, y: 85.07536789290482 }));
     port.setConnectionDirection(1);
     port.setBackgroundColor("#37B1DE");
     port.setName("pin_qc");
     port.setMaxFanOut(20);
     // pin_qb
     port = this.addPort(new DecoratedOutputPort(), new draw2d.layout.locator.XYRelPortLocator({x: 101.66274193548345, y: 72.9379707249031 }));
     port.setConnectionDirection(1);
     port.setBackgroundColor("#37B1DE");
     port.setName("pin_qb");
     port.setMaxFanOut(20);
     // pin_gnd
     port = this.addPort(new DecoratedInputPort(), new draw2d.layout.locator.XYRelPortLocator({x: 101.66274193548345, y: 60.434161566923756 }));
     port.setConnectionDirection(1);
     port.setBackgroundColor("#37B1DE");
     port.setName("pin_gnd");
     port.setMaxFanOut(20);
     // pin_qd
     port = this.addPort(new DecoratedOutputPort(), new draw2d.layout.locator.XYRelPortLocator({x: 101.66274193548345, y: 48.854931996988036 }));
     port.setConnectionDirection(1);
     port.setBackgroundColor("#37B1DE");
     port.setName("pin_qd");
     port.setMaxFanOut(20);
     // pin_qa
     port = this.addPort(new DecoratedOutputPort(), new draw2d.layout.locator.XYRelPortLocator({x: 101.66274193548345, y: 36.16364203747093 }));
     port.setConnectionDirection(1);
     port.setBackgroundColor("#37B1DE");
     port.setName("pin_qa");
     port.setMaxFanOut(20);
     // pin_nc2
     port = this.createPort("hybrid", new draw2d.layout.locator.XYRelPortLocator({x: 101.66274193548345, y: 23.472352077952714 }));
     port.setConnectionDirection(1);
     port.setBackgroundColor("#37B1DE");
     port.setName("pin_nc2");
     port.setMaxFanOut(20);
     // pin_cka
     port = this.addPort(new DecoratedInputPort(), new draw2d.layout.locator.XYRelPortLocator({x: 101.66274193548345, y: 11.258619078705706 }));
     port.setConnectionDirection(1);
     port.setBackgroundColor("#37B1DE");
     port.setName("pin_cka");
     port.setMaxFanOut(20);
   },

   createShapeElement : function()
   {
      var shape = this._super();
      this.originalWidth = 62;
      this.originalHeight= 163.7501000000002;
      return shape;
   },

   createSet: function()
   {
       this.canvas.paper.setStart();
       var shape = null;
       // BoundingBox
       shape = this.canvas.paper.path("M0,0 L62,0 L62,163.7501000000002 L0,163.7501000000002");
       shape.attr({"stroke":"none","stroke-width":0,"fill":"none"});
       shape.data("name","BoundingBox");
       
       // Rectangle
       shape = this.canvas.paper.path('M0 0L62 0L62 160L0 160Z');
       shape.attr({"stroke":"rgba(48,48,48,1)","stroke-width":1,"fill":"rgba(255,255,255,1)","dasharray":null,"stroke-dasharray":null,"opacity":1});
       shape.data("name","Rectangle");
       
       // Circle
       shape = this.canvas.paper.path('M22.12574568545824 0L22.086165814078413 0.45240000000012515L22.22918310813293 2.0870951512442844L22.65388948218606 3.672120917512075L23.34738044797632 5.159317092960919L24.288584633432038 6.503495974353427L25.44890402564488 7.6638153665680875L26.793082907039206 8.605019552021986L28.28027908248623 9.298510517812247L29.865304848754022 9.723216891867196L31.5 9.866234185919893L33.13469515124234 9.723216891867196L34.71972091751195 9.298510517812247L36.20691709296079 8.605019552021986L37.55109597435148 7.6638153665680875L38.71141536656796 6.503495974353427L39.65261955202004 5.159317092960919L40.3461105178103 3.672120917512075L40.77081689186525 2.0870951512442844L40.91383418591977 0.45240000000012515L40.87425431454176 0L22.12574568545824 0Z');
       shape.attr({"stroke":"rgba(27,27,27,1)","stroke-width":1,"fill":"rgba(245,245,245,1)","dasharray":null,"stroke-dasharray":null,"opacity":1});
       shape.data("name","Circle");
       
       // Label
       shape = this.canvas.paper.text(0,0,'CKB');
       shape.attr({"x":4.9768999999996595,"y":18.366234185919893,"text-anchor":"start","text":"CKB","font-family":"\"Arial\"","font-size":9,"stroke":"#000000","fill":"#080808","stroke-scale":true,"font-weight":"normal","stroke-width":0,"opacity":1});
       shape.data("name","Label");
       
       // Label
       shape = this.canvas.paper.text(0,0,'R01');
       shape.attr({"x":6.4768999999996595,"y":38.86623418591989,"text-anchor":"start","text":"R01","font-family":"\"Arial\"","font-size":9,"stroke":"#000000","fill":"#080808","stroke-scale":true,"font-weight":"normal","stroke-width":0,"opacity":1});
       shape.data("name","Label");
       
       // Label
       shape = this.canvas.paper.text(0,0,'R02');
       shape.attr({"x":6.4768999999996595,"y":59.36623418591989,"text-anchor":"start","text":"R02","font-family":"\"Arial\"","font-size":9,"stroke":"#000000","fill":"#080808","stroke-scale":true,"font-weight":"normal","stroke-width":0,"opacity":1});
       shape.data("name","Label");
       
       // Label
       shape = this.canvas.paper.text(0,0,'NC');
       shape.attr({"x":6.9768999999996595,"y":80.22693418592007,"text-anchor":"start","text":"NC","font-family":"\"Arial\"","font-size":9,"stroke":"#000000","fill":"#080808","stroke-scale":true,"font-weight":"normal","stroke-width":0,"opacity":1});
       shape.data("name","Label");
       
       // Label
       shape = this.canvas.paper.text(0,0,'VCC');
       shape.attr({"x":6.4768999999996595,"y":98.72693418592007,"text-anchor":"start","text":"VCC","font-family":"\"Arial\"","font-size":9,"stroke":"#000000","fill":"#080808","stroke-scale":true,"font-weight":"normal","stroke-width":0,"opacity":1});
       shape.data("name","Label");
       
       // Label
       shape = this.canvas.paper.text(0,0,'R91');
       shape.attr({"x":6.9768999999996595,"y":119.9359999999997,"text-anchor":"start","text":"R91","font-family":"\"Arial\"","font-size":9,"stroke":"#000000","fill":"#080808","stroke-scale":true,"font-weight":"normal","stroke-width":0,"opacity":1});
       shape.data("name","Label");
       
       // Label
       shape = this.canvas.paper.text(0,0,'R92');
       shape.attr({"x":6.9768999999996595,"y":139.3654341859201,"text-anchor":"start","text":"R92","font-family":"\"Arial\"","font-size":9,"stroke":"#000000","fill":"#080808","stroke-scale":true,"font-weight":"normal","stroke-width":0,"opacity":1});
       shape.data("name","Label");
       
       // Label
       shape = this.canvas.paper.text(0,0,'QC');
       shape.attr({"x":42.484375,"y":139.3654341859201,"text-anchor":"start","text":"QC","font-family":"\"Arial\"","font-size":9,"stroke":"#000000","fill":"#080808","stroke-scale":true,"font-weight":"normal","stroke-width":0,"opacity":1});
       shape.data("name","Label");
       
       // Label
       shape = this.canvas.paper.text(0,0,'QB');
       shape.attr({"x":43.2265625,"y":118.9359999999997,"text-anchor":"start","text":"QB","font-family":"\"Arial\"","font-size":9,"stroke":"#000000","fill":"#080808","stroke-scale":true,"font-weight":"normal","stroke-width":0,"opacity":1});
       shape.data("name","Label");
       
       // Label
       shape = this.canvas.paper.text(0,0,'GND');
       shape.attr({"x":35.984375,"y":98.72693418592007,"text-anchor":"start","text":"GND","font-family":"\"Arial\"","font-size":9,"stroke":"#000000","fill":"#080808","stroke-scale":true,"font-weight":"normal","stroke-width":0,"opacity":1});
       shape.data("name","Label");
       
       // Label
       shape = this.canvas.paper.text(0,0,'QD');
       shape.attr({"x":42.484375,"y":80.22693418592007,"text-anchor":"start","text":"QD","font-family":"\"Arial\"","font-size":9,"stroke":"#000000","fill":"#080808","stroke-scale":true,"font-weight":"normal","stroke-width":0,"opacity":1});
       shape.data("name","Label");
       
       // Label
       shape = this.canvas.paper.text(0,0,'QA');
       shape.attr({"x":42.484375,"y":58.86623418591989,"text-anchor":"start","text":"QA","font-family":"\"Arial\"","font-size":9,"stroke":"#000000","fill":"#080808","stroke-scale":true,"font-weight":"normal","stroke-width":0,"opacity":1});
       shape.data("name","Label");
       
       // Label
       shape = this.canvas.paper.text(0,0,'NC');
       shape.attr({"x":42.484375,"y":38.36623418591989,"text-anchor":"start","text":"NC","font-family":"\"Arial\"","font-size":9,"stroke":"#000000","fill":"#080808","stroke-scale":true,"font-weight":"normal","stroke-width":0,"opacity":1});
       shape.data("name","Label");
       
       // Label
       shape = this.canvas.paper.text(0,0,'CKA');
       shape.attr({"x":37.46875,"y":18.366234185919893,"text-anchor":"start","text":"CKA","font-family":"\"Arial\"","font-size":9,"stroke":"#000000","fill":"#080808","stroke-scale":true,"font-weight":"normal","stroke-width":0,"opacity":1});
       shape.data("name","Label");
       
       // Label
       shape = this.canvas.paper.text(0,0,'74LS90');
       shape.attr({"x":7.5859375,"y":152.2501000000002,"text-anchor":"start","text":"74LS90","font-family":"\"Arial\"","font-size":13,"stroke":"#000000","fill":"#080808","stroke-scale":true,"font-weight":"normal","stroke-width":0,"opacity":1});
       shape.data("name","Label");
       

       return this.canvas.paper.setFinish();
   }
});

/**
 * Generated Code for the Draw2D touch HTML5 lib.
 * File will be generated if you save the *.shape file.
 *
 * by 'Draw2D Shape Designer'
 *
 * Custom JS code to tweak the standard behaviour of the generated
 * shape. add your custom code and event handler here.
 *
 * Looks disconcerting - extending my own class. But this is a good method to
 * merge basic code and override them with custom methods.
 */
circuit_74LSXX_74LS90 = circuit_74LSXX_74LS90.extend({

    init: function(attr, setter, getter){
         this._super(attr, setter, getter);

        this.attr({resizeable:false});
        this.installEditPolicy(new draw2d.policy.figure.AntSelectionFeedbackPolicy());

        // internal the 74ls90 is build with two seperated counter
        // A Mod2 and a Mod5 counter. Cascading them is a BCD Counter (Mod10)
        //
        this.last_t1=true;
        this.last_t2=true;
        this.counter1=0; // mod 2 counter
        this.counter2=0; // mod 5 counter
    },

    /**
     *  Called by the simulator for every calculation
     *  loop
     *  @param {Object} context context where objects can store or handover global variables to other objects.
     *  @required
     **/
    calculate:function( context)
    {
        var t1 = this.getInputPort("pin_cka").getBooleanValue();
        var t2 = this.getInputPort("pin_ckb").getBooleanValue();

        var falling1 = this.last_t1===true && t1===false; 
        var falling2 = this.last_t2===true && t2===false; 
        
        if(falling1===true){
            var a = this.getOutputPort("pin_qa");
            a.setValue(!!(this.counter1 & 1));
            this.counter1= (this.counter1+1)%2;
        }
        
        if(falling2===true){
            var b = this.getOutputPort("pin_qb");
            var c = this.getOutputPort("pin_qc");
            var d = this.getOutputPort("pin_qd");
            b.setValue(!!(this.counter2 & 1));
            c.setValue(!!(this.counter2 & 2));
            d.setValue(!!(this.counter2 & 4));
            this.counter2= (this.counter2+1)%5;
        }
        this.last_t1 = t1;
        this.last_t2 = t2;
    },


    /**
     *  Called if the simulation mode is starting
     *  @required
     **/
    onStart:function( context )
    {
    },

    /**
     *  Called if the simulation mode is stopping
     *  @required
     **/
    onStop:function( context )
    {
    },

    /**
     * Get the simulator a hint which kind of hardware the shapes requires or supports
     * This helps the simulator to bring up some dialogs and messages if any new hardware is connected/get lost
     * and your are running a circuit which needs this kind of hardware...
     **/
    getRequiredHardware: function(){
      return {
        raspi: false,
        arduino: false
      }
    }

});