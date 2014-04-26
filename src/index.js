

/*


*/

(function () {

    FwAdComponent = (function () {

        var FwAdComponent = function (opts) {

            if(!opts) 
                this.handleError("no options defined for Ad Component");
            else {
                if(!opts.networkId)
                    this.handleError("Network Id not defined");

                if(!opts.profileIdJs)
                    this.handleError("Profile Id for JS not defined");

                if(!opts.profileIdAS3)
                    this.handleError("Profile Id for AS3 not defined");

                if(!opts.adServerUrl)
                    this.handleError("Ad Server URL not defined");

                if(!opts.videoAssetId)
                    this.handleError("Video Asset Id not defined");

                if(!opts.siteSectionId)
                    this.handleError("Site Section Id not defined");

                if(!opts.displayBaseHtml)
                    this.handleError("HTML5 Video Display Base not defined");

                if(!opts.contentDuration)
                    opts.contentDuration = 0;
            }

            this._events = [];
            this._options = opts;

            this.initialize();
      

        };

        FwAdComponent.prototype.initialize = function () {


            //Define AdManager Instance
            this._adManager = new tv.freewheel.SDK.AdManager();
            this._adManager.setNetwork(this._options.networkId);
            this._adManager.setServer(this._options.adServerUrl);

            //Define AdManager Context
            this._amContext = this._adManager.newContext();
            this._amContext.setProfile(this._options.profileIdJs);
            this._amContext.setVideoAsset(this._options.videoAssetId, this._options.contentDuration, this._options.networkId);
            this._amContext.setSiteSection(this._options.siteSectionId, this._options.networkId);
            this._amContext.registerVideoDisplayBase(this._options.displayBaseHtml);

            this._amContext.addEventListener(tv.freewheel.SDK.EVENT_REQUEST_COMPLETE,this.proxy(this.onRequestComplete, this));
            this._amContext.submitRequest();

        };

        FwAdComponent.prototype.onRequestComplete = function (event) {
            console.log(event);
        };



        FwAdComponent.prototype.on = function (event, callback) {
            if(!this._events[event]) this._events[event] = [];
            this._events[event].push(callback);
        };

        FwAdComponent.prototype.off = function (event, callback) {
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

        FwAdComponent.prototype.trigger = function (event) {
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

        FwAdComponent.prototype.proxy = function (callback , context) {

            var ctx;

            if(!context)
                ctx = this;
            else
                ctx = context;

            if(typeof(callback) === "function")
                return callback.bind(ctx);
            else
                this.handleError("No Function Passed To Proxy");
            
        };

        FwAdComponent.prototype.handleError = function (message) {
            throw new Error(message);
        };


        return FwAdComponent;

    })();



}).call(window);   