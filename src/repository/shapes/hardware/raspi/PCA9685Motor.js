// Generated Code for the Draw2D touch HTML5 lib.
// File will be generated if you save the *.shape file.
//
// created with http://www.draw2d.org
//
//
var hardware_raspi_PCA9685Motor = CircuitFigure.extend({

   NAME: "hardware_raspi_PCA9685Motor",
   VERSION: "2.0.343_1136",

   init:function(attr, setter, getter)
   {
     var _this = this;

     this._super( $.extend({stroke:0, bgColor:null, width:103,height:80},attr), setter, getter);
     var port;
     // input_channel_pwm
     port = this.addPort(new DecoratedInputPort(), new draw2d.layout.locator.XYRelPortLocator({x: 0, y: 28.515090042113798 }));
     port.setConnectionDirection(3);
     port.setBackgroundColor("#37B1DE");
     port.setName("input_channel_pwm");
     port.setMaxFanOut(1);
     // input_channel_onoff
     port = this.addPort(new DecoratedInputPort(), new draw2d.layout.locator.XYRelPortLocator({x: 0, y: 75.73036016845663 }));
     port.setConnectionDirection(3);
     port.setBackgroundColor("#37B1DE");
     port.setName("input_channel_onoff");
     port.setMaxFanOut(1);
   },

   createShapeElement : function()
   {
      var shape = this._super();
      this.originalWidth = 103;
      this.originalHeight= 80;
      return shape;
   },

   createSet: function()
   {
       this.canvas.paper.setStart();
       var shape = null;
       // BoundingBox
       shape = this.canvas.paper.path("M0,0 L103,0 L103,80 L0,80");
       shape.attr({"stroke":"none","stroke-width":0,"fill":"none"});
       shape.data("name","BoundingBox");
       
       // Rectangle
       shape = this.canvas.paper.path('M0,5Q0,0 5, 0L98,0Q103,0 103, 5L103,75Q103,80 98, 80L5,80Q0,80 0, 75L0,5');
       shape.attr({"stroke":"rgba(48,48,48,1)","stroke-width":1,"fill":"rgba(255,255,255,1)","dasharray":null,"stroke-dasharray":null,"opacity":1});
       shape.data("name","Rectangle");
       
       // channelLabel
       shape = this.canvas.paper.text(0,0,'PWM');
       shape.attr({"x":11,"y":22.714972033691083,"text-anchor":"start","text":"PWM","font-family":"\"Arial\"","font-size":10,"stroke":"#000000","fill":"#080808","stroke-scale":true,"font-weight":"normal","stroke-width":0,"opacity":1});
       shape.data("name","channelLabel");
       
       // Label
       shape = this.canvas.paper.text(0,0,'on/off');
       shape.attr({"x":10,"y":60.5842881347653,"text-anchor":"start","text":"on/off","font-family":"\"Arial\"","font-size":10,"stroke":"#000000","fill":"#080808","stroke-scale":true,"font-weight":"normal","stroke-width":0,"opacity":1});
       shape.data("name","Label");
       
       // Label
       shape = this.canvas.paper.text(0,0,'PCA9865');
       shape.attr({"x":59.06247499999972,"y":49.93796203369129,"text-anchor":"start","text":"PCA9865","font-family":"\"Arial\"","font-size":7,"stroke":"#000000","fill":"#080808","stroke-scale":true,"font-weight":"normal","stroke-width":0,"opacity":1});
       shape.data("name","Label");
       
       // Label
       shape = this.canvas.paper.text(0,0,'Motor Driver');
       shape.attr({"x":35.89059999999972,"y":39.40582203369104,"text-anchor":"start","text":"Motor Driver","font-family":"\"Arial\"","font-size":10,"stroke":"#000000","fill":"#080808","stroke-scale":true,"font-weight":"normal","stroke-width":0,"opacity":1});
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
hardware_raspi_PCA9685Motor = hardware_raspi_PCA9685Motor.extend({

    init: function(attr, setter, getter){
         this._super(attr, setter, getter);

        this.channel = "0"
        this.on("change:userData.channel",(emitter, event)=>{
            this.layerAttr("channelLabel", {text: "PWM channel "+event.value})
            this.channel = event.value;
        });
        this.on("added",(emitter, event)=>{
             this.layerAttr("channelLabel", {text:  "PWM channel "+this.attr("userData.channel")})
        });
        this.attr("userData.channel",this.channel)
        
        this.attr({
            resizeable:false
        });
        this.installEditPolicy(new draw2d.policy.figure.AntSelectionFeedbackPolicy());
    },

    /**
     *  Called by the simulator for every calculation
     *  loop
     *  @param {Object} context context where objects can store or handover global variables to other objects.
     *  @required
     **/
    calculate:function( context)
    {
        let port_pwm   = this.getInputPort("input_channel_pwm");
        let port_onoff = this.getInputPort("input_channel_onoff");
        if(port_pwm.hasChangedValue() || port_onoff.hasChangedValue()){
            let pwm  = port_pwm.getValue();
            let onoff = port_onoff.getValue();
            if(onoff){
                hardware.pca9685.set(parseInt(this.channel), onoff);
                hardware.pca9685.pwm(parseInt(this.channel), pwm);
            }
            else{
                hardware.pca9685.set(parseInt(this.channel), onoff);
            }
        }
    },


    /**
     *  Called if the simulation mode is starting
     *  @required
     **/
    onStart:function( context )
    {
        let port_pwm   = this.getInputPort("input_channel_pwm");
        let port_onoff = this.getInputPort("input_channel_onoff");

        let pwm  = port_pwm.getValue();
        let onoff = port_onoff.getValue();
        if(onoff){
            hardware.pca9685.set(parseInt(this.channel), onoff);
            hardware.pca9685.pwm(parseInt(this.channel), pwm);
        }
        else{
            hardware.pca9685.set(parseInt(this.channel), onoff);
        }
    },

    /**
     *  Called if the simulation mode is stopping
     *  @required
     **/
    onStop:function( context )
    {
        // be save - switch off the channel.
        hardware.pca9685.set(parseInt(this.channel), 0);
    },

    /**
     * Get the simulator a hint which kind of hardware the shapes requires or supports
     * This helps the simulator to bring up some dialogs and messages if any new hardware is connected/get lost
     * and your are running a circuit which needs this kind of hardware...
     **/
    getRequiredHardware: function(){
      return {
        raspi: false,
        arduino: false,
        pca9685: true
      };
    },
    
        
        
    setPersistentAttributes: function (memento) 
    {
        this._super(memento);

        this.channel = this.attr("userData.channel");
    },
    
    
    getParameterSettings: function () {
        return [
            {
                name: "channel",
                label: "The PCA9685 Channel to use",
                property: {
                    type: "enum",
                    values: [
                        "0",
                        "1",
                        "2",
                        "3",
                        "4",
                        "5",
                        "6",
                        "7",
                        "8",
                        "9",
                        "10",
                        "11",
                        "12",
                        "13",
                        "14",
                        "15"
                    ]
                }
            }];
    }


});