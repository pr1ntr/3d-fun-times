


Number.prototype.deg2rad = function () {
    return this * (Math.PI/180);
};


/*


*/

(function () {

    Visualizer = (function () {

        var Visualizer = function (opts) {

            this.enabled = true;
            this.elements = [];

            this.createScene();
            this.createMaterials();
            this.createGeometery();

            this.start();


        };

        Visualizer.prototype.render = function () {
            if(this.enabled) {
                requestAnimationFrame(this.proxy(this.render,this));
          
                this.renderer.render(this.scene, this.camera);

            }

                
        };

        Visualizer.prototype.start = function(first_argument) {
            
            this.render();
            //this.rotateWaveform();

        };

        Visualizer.prototype.rotateWaveform = function() {
            //testing compatibility
            TweenLite.to(this.elements.waveform.rotation , 3 , {
                y: (360).deg2rad(),
                ease: Linear.easeNone
            });
        };

        Visualizer.prototype.createMaterials = function() {
            
        };

        Visualizer.prototype.createGeometery = function() {
            

           




            for(var i = 0; i < 10; i++ ) {
                this.elements[i+"_wave_object"] = this.drawCylinder(10 ,1, 1);
                this.elements[i+"_wave_object"].position.y = i-2;
            }

            
            



         
            for(var key in this.elements) {
                this.scene.add(this.elements[key]);
            }
           
        };

        Visualizer.prototype.drawCylinder = function(s , r , r2) {
            var radius = r || 1;
            var prevRadius = r2 || radius;
            var sides = s || 5;

            var geometry = new THREE.Geometry(1,1,1);
            var material = new THREE.LineBasicMaterial( { color: 0xffffff } );

           
    

            var lx = 0;
            var lz = 0;
            for(var i = 0; i < (360).deg2rad() ; i+=(360/sides).deg2rad()) {
              
                var x1 = radius * (Math.cos(i));                   
                var z1 = radius * (Math.sin(i));

                var x2 = prevRadius * (Math.cos(i));
                var z2 = prevRadius * (Math.sin(i));

                if(i === 0){
                    lx = x1;
                    lz = z1;
                }

                geometry.vertices.push(new THREE.Vector3(x1,0,z1));
                geometry.vertices.push(new THREE.Vector3(x2,-1,z2));
                geometry.vertices.push(new THREE.Vector3(x1,0,z1));

            }

            geometry.vertices.push(new THREE.Vector3(lx,0,lz));     

            return new THREE.Line( geometry, material );
            

        };

        Visualizer.prototype.createScene = function () {
            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight , 0.1 , 1000);
            this.camera.position.z = 5;
            this.camera.position.y = 1;
            this.renderer = new THREE.WebGLRenderer();

            this.renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild( this.renderer.domElement ); 

        };

   


        Visualizer.prototype.on = function (event, callback) {
            if(!this._events[event]) this._events[event] = [];
            this._events[event].push(callback);
        };

        Visualizer.prototype.off = function (event, callback) {
            for(var binding in this._events) {  
                if(binding === event) {
                    var callGroup = this._events[binding];
                    if(callback) {
                        for(var hk = 0 ; hk < callGroup.length; hk++) {
                            var handler = callGroup[hk];
                            if(handler.toString() === callback.toString()) {
                                callGroup.splice(hk,1);
                                return;
                            }
                        }
                        this.off(event);
                    }else{
                        delete this._events[binding];
                        return;
                    }

                }
            }
        };

        Visualizer.prototype.trigger = function (event) {
            for(var binding in this._events) {
                if(binding === event) {
                    var callGroup = this._events[binding];
                    for(var hk = 0 ; hk < callGroup.length; hk++) {
                        var handler = callGroup[hk];
                        handler();
                    }
                }
            }
        };

        Visualizer.prototype.proxy = function (callback , context, args) {

            var ctx;

            if(!context)
                ctx = this;
            else
                ctx = context;
            if(typeof(callback) === "function")
                return callback.bind(ctx, args);
            else
                this.handleError("No Function Passed To Proxy");
            
        };

    


        Visualizer.prototype.handleError = function (message) {
            throw new Error(message);
        };


        return Visualizer;

    })();



}).call(window);   