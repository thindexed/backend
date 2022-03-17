// Generated Code for the Draw2D touch HTML5 lib.
// File will be generated if you save the *.shape file.
//
// created with http://www.draw2d.org
//
//
var hardware_raspi_PWMWrite = CircuitFigure.extend({

   NAME: "hardware_raspi_PWMWrite",
   VERSION: "2.0.343_1136",

   init:function(attr, setter, getter)
   {
     var _this = this;

     this._super( $.extend({stroke:0, bgColor:null, width:90,height:22},attr), setter, getter);
     var port;
     // input_port1
     port = this.addPort(new DecoratedInputPort(), new draw2d.layout.locator.XYRelPortLocator({x: -2.344359877472218, y: 50.00000000000001 }));
     port.setConnectionDirection(3);
     port.setBackgroundColor("#37B1DE");
     port.setName("input_port1");
     port.setMaxFanOut(1);
   },

   createShapeElement : function()
   {
      var shape = this._super();
      this.originalWidth = 90;
      this.originalHeight= 22;
      return shape;
   },

   createSet: function()
   {
       this.canvas.paper.setStart();
       var shape = null;
       // BoundingBox
       shape = this.canvas.paper.path("M0,0 L90,0 L90,22 L0,22");
       shape.attr({"stroke":"none","stroke-width":0,"fill":"none"});
       shape.data("name","BoundingBox");
       
       // Rectangle
       shape = this.canvas.paper.path('M88.0000160470528,20.967186981509105Q90,20.975198719999753 90, 18.975198719999753L90,2.975198719999753Q90,0.9751987199997529 88, 0.9751987199997529L13.28761223528818,0.9751987199997529Q11.28761223528818,0.9751987199997529 9.790593909516895, 2.301447615307472L1.4970183257712844,9.648949824692034Q0,10.975198719999753 1.5282300564805649, 12.265358746690012L9.944425002338763,19.370465893309543Q11.472655058819328,20.660625919999802 13.472639011766532, 20.66863765849045L88.0000160470528,20.967186981509105');
       shape.attr({"stroke":"rgba(48,48,48,1)","stroke-width":1,"fill":"rgba(255,255,255,1)","dasharray":null,"stroke-dasharray":null,"opacity":1});
       shape.data("name","Rectangle");
       
       // gpioPinLabel
       shape = this.canvas.paper.text(0,0,'PWM Pin#');
       shape.attr({"x":9.390076110275004,"y":11,"text-anchor":"start","text":"PWM Pin#","font-family":"\"Arial\"","font-size":12,"stroke":"#000000","fill":"#080808","stroke-scale":true,"font-weight":"normal","stroke-width":0,"opacity":1});
       shape.data("name","gpioPinLabel");
       

       return this.canvas.paper.setFinish();
   }
});

/**
 * by 'Draw2D Shape Designer'
 *
 * Custom JS code to tweak the standard behaviour of the generated
 * shape. add your custome code and event handler here.
 *
 *
 */
hardware_raspi_PWMWrite = hardware_raspi_PWMWrite.extend({

    init: function(attr, setter, getter){
         this._super(attr, setter, getter);

         this.raspiIcon = "data:image/png;base64,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"

        this.img = new draw2d.shape.basic.Image({
            width: this.getHeight()/5*3, 
            height: this.getHeight()/5*4,
            selectable: false,
            deleteable: false,
            resizeable:false,
            draggable: false,
            path: this.raspiIcon
        });
        this.img.hitTest = ()=>false;
        this.add(this.img, new draw2d.layout.locator.XYAbsPortLocator({x:68, y:3}));

        this.gpioPin = "gpio_5";
        this.on("change:userData.gpioPin",(emitter, event)=>{
            this.layerAttr("gpioPinLabel", {text: this.getLabel(event.value)});
            this.gpioPin = event.value;
        });
        this.on("added",(emitter, event)=>{
             this.layerAttr("gpioPinLabel", {text: this.getLabel(this.attr("userData.gpioPin"))});
        });
        this.attr("userData.gpioPin",this.gpioPin);
        
        this.attr({
            resizeable:false
        });
        this.installEditPolicy(new draw2d.policy.figure.AntSelectionFeedbackPolicy());

    },

    /**
     *  Called by the simulator for every calculation
     *  loop
     *  @required
     **/
    calculate:function( context)
    {
        var port = this.getInputPort("input_port1");
        if(port.hasChangedValue()){
            hardware.raspi.pwm(this.gpioPin, port.getValue());
        }
    },
    

    /**
     *  Called if the simulation mode is starting
     *  @required
     **/
    onStart:function( context )
    {
        var port = this.getInputPort("input_port1");
        hardware.raspi.mode(this.gpioPin, "OUTPUT");
        hardware.raspi.pwm(this.gpioPin, port.getValue());
    },

    /**
     *  Called if the simulation mode is stopping
     *  @required
     **/
    onStop:function( context )
    {
    },
    
    getLabel: function(pin){
        return "PWM "+pin.split("_")[1];
    },
    
    getRequiredHardware: function(){
      return {
        raspi: true,
        arduino: false
      };
    },
        
        
    setPersistentAttributes: function (memento) 
    {
        this._super(memento);

        this.img = this.getChildren().find( child => child instanceof draw2d.shape.basic.Image);
        this.remove(this.img);
        this.add(this.img, new draw2d.layout.locator.XYAbsPortLocator({x:68, y:3}));
        this.img.hitTest = ()=>false;

        this.gpioPin = this.attr("userData.gpioPin");
    },
    
    
    getParameterSettings: function () {
        return [
            {
                name: "gpioPin",
                label: "The RaspberryPI GPIO Pin",
                property: {
                    type: "enum",
                    values: [
                        "gpio_5",
                        "gpio_6",
                        "gpio_7",
                        "gpio_8",
                        "gpio_9",
                        "gpio_10",
                        "gpio_11",
                        "gpio_12",
                        "gpio_13",
                        "gpio_16",
                        "gpio_17",
                        "gpio_18",
                        "gpio_19",
                        "gpio_20",
                        "gpio_21",
                        "gpio_22",
                        "gpio_23",
                        "gpio_24",
                        "gpio_25",
                        "gpio_26",
                        "gpio_27",
                    ]
                }
            }];
    }

    
});