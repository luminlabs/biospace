/*
 * Wistia Upload Widget
 *
 * jQuery, SWFUpload, and the swfobject plugin for SWFUpload
 * have all been copied into this file.  This cleans up the
 * embed code a bit.
 * TODO: Convert this to dynamically load those files.
 */

if (typeof(SWFUpload) === 'undefined') {

/**
 * SWFUpload v2.1.0 by Jacob Roberts, Feb 2008, http://www.swfupload.org, http://swfupload.googlecode.com, http://www.swfupload.org
 * -------- -------- -------- -------- -------- -------- -------- --------
 * SWFUpload is (c) 2006 Lars Huring, Olov NilzÃ©n and Mammon Media and is released under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * See Changelog.txt for version history
 *
 */


/* *********** */
/* Constructor */
/* *********** */

var SWFUpload = function (settings) {
	this.initSWFUpload(settings);
};

SWFUpload.prototype.initSWFUpload = function (settings) {
	try {
		this.customSettings = {};	// A container where developers can place their own settings associated with this instance.
		this.settings = settings;
		this.eventQueue = [];
		this.movieName = "SWFUpload_" + SWFUpload.movieCount++;
		this.movieElement = null;

		// Setup global control tracking
		SWFUpload.instances[this.movieName] = this;

		// Load the settings.  Load the Flash movie.
		this.initSettings();
		this.loadFlash();
		this.displayDebugInfo();
	} catch (ex) {
		delete SWFUpload.instances[this.movieName];
		throw ex;
	}
};

/* *************** */
/* Static Members  */
/* *************** */
SWFUpload.instances = {};
SWFUpload.movieCount = 0;
SWFUpload.version = "2.2.0 Alpha";
SWFUpload.QUEUE_ERROR = {
	QUEUE_LIMIT_EXCEEDED	  		: -100,
	FILE_EXCEEDS_SIZE_LIMIT  		: -110,
	ZERO_BYTE_FILE			  		: -120,
	INVALID_FILETYPE		  		: -130
};
SWFUpload.UPLOAD_ERROR = {
	HTTP_ERROR				  		: -200,
	MISSING_UPLOAD_URL	      		: -210,
	IO_ERROR				  		: -220,
	SECURITY_ERROR			  		: -230,
	UPLOAD_LIMIT_EXCEEDED	  		: -240,
	UPLOAD_FAILED			  		: -250,
	SPECIFIED_FILE_ID_NOT_FOUND		: -260,
	FILE_VALIDATION_FAILED	  		: -270,
	FILE_CANCELLED			  		: -280,
	UPLOAD_STOPPED					: -290
};
SWFUpload.FILE_STATUS = {
	QUEUED		 : -1,
	IN_PROGRESS	 : -2,
	ERROR		 : -3,
	COMPLETE	 : -4,
	CANCELLED	 : -5
};
SWFUpload.BUTTON_ACTION = {
	SELECT_FILE  : -100,
	SELECT_FILES : -110,
	START_UPLOAD : -120
};

/* ******************** */
/* Instance Members  */
/* ******************** */

// Private: initSettings ensures that all the
// settings are set, getting a default value if one was not assigned.
SWFUpload.prototype.initSettings = function () {
	this.ensureDefault = function (settingName, defaultValue) {
		this.settings[settingName] = (this.settings[settingName] == undefined) ? defaultValue : this.settings[settingName];
	};
	
	// Upload backend settings
	this.ensureDefault("upload_url", "");
	this.ensureDefault("file_post_name", "Filedata");
	this.ensureDefault("post_params", {});
	this.ensureDefault("use_query_string", false);
	this.ensureDefault("requeue_on_error", false);
	
	// File Settings
	this.ensureDefault("file_types", "*.*");
	this.ensureDefault("file_types_description", "All Files");
	this.ensureDefault("file_size_limit", 0);	// Default zero means "unlimited"
	this.ensureDefault("file_upload_limit", 0);
	this.ensureDefault("file_queue_limit", 0);

	// Flash Settings
	this.ensureDefault("flash_url", "swfupload_f9.swf");
	this.ensureDefault("flash_color", "#000000");
	this.ensureDefault("flash_wmode", "transparent");
	this.ensureDefault("flash_container_id", null);
	this.ensureDefault("flash_width", '100%');
	this.ensureDefault("flash_height", '100%');

	// Button Settings
	/*
	this.ensureDefault("button_image_url", 0);
	this.ensureDefault("button_width", 1);
	this.ensureDefault("button_height", 1);
	this.ensureDefault("button_text", "");
	this.ensureDefault("button_text_style", "");
	this.ensureDefault("button_action", SWFUpload.BUTTON_ACTION.SELECT_FILES);
	this.ensureDefault("button_disabled", false);
	this.ensureDefault("button_placeholder_id", null);
	*/

	// Debug Settings
	this.ensureDefault("debug", false);
	this.settings.debug_enabled = this.settings.debug;	// Here to maintain v2 API
	
	// Event Handlers
	this.settings.return_upload_start_handler = this.returnUploadStart;
	this.ensureDefault("swfupload_loaded_handler", null);
	this.ensureDefault("file_dialog_start_handler", null);
	this.ensureDefault("file_queued_handler", null);
	this.ensureDefault("file_queue_error_handler", null);
	this.ensureDefault("file_dialog_complete_handler", null);
	
	this.ensureDefault("upload_start_handler", null);
	this.ensureDefault("upload_progress_handler", null);
	this.ensureDefault("upload_error_handler", null);
	this.ensureDefault("upload_success_handler", null);
	this.ensureDefault("upload_complete_handler", null);
	
	this.ensureDefault("debug_handler", this.debugMessage);

	this.ensureDefault("custom_settings", {});

	// Other settings
	this.customSettings = this.settings.custom_settings;
	
	delete this.ensureDefault;
};

SWFUpload.prototype.loadFlash = function () {
	this.insertFlash();
};

// Private: appendFlash gets the HTML tag for the Flash
// It then appends the flash to the body
SWFUpload.prototype.appendFlash = function () {
	var targetElement, container;

	// Make sure an element with the ID we are going to use doesn't already exist
	if (document.getElementById(this.movieName) !== null) {
		throw "ID " + this.movieName + " is already in use. The Flash Object could not be added";
	}

	// Get the body tag where we will be adding the flash movie
	targetElement = document.getElementsByTagName("body")[0];

	if (targetElement == undefined) {
		throw "Could not find the 'body' element.";
	}

	// Append the container and load the flash
	container = document.createElement("div");
	container.style.width = "1px";
	container.style.height = "1px";

	targetElement.appendChild(container);
	container.innerHTML = this.getFlashHTML();	// Using innerHTML is non-standard but the only sensible way to dynamically add Flash in IE (and maybe other browsers)
};

// Private: insertFlash inserts the flash movie into the container element.
SWFUpload.prototype.insertFlash = function () {
	var targetElement, container;

	// Make sure an element with the ID we are going to use doesn't already exist
	if (document.getElementById(this.movieName) !== null) {
		throw "ID " + this.movieName + " is already in use. The Flash Object could not be added";
	}

	// Get the container elt into which we'll insert the flash movie
	containerElement = document.getElementById(this.settings.flash_container_id);

	if (containerElement == undefined) {
		throw "Could not find the container element.";
	}

	// place flash embed inside the container element
	containerElement.innerHTML = this.getFlashHTML();
};

// Private: getFlashHTML generates the object tag needed to embed the flash in to the document
SWFUpload.prototype.getFlashHTML = function () {
	// Flash Satay object syntax: http://www.alistapart.com/articles/flashsatay
	return ['<object id="', this.movieName, '" type="application/x-shockwave-flash" data="', this.settings.flash_url, '" width="', this.settings.flash_width, '" height="', this.settings.flash_height, '" style="-moz-user-focus: ignore;">',
				'<param name="movie" value="', this.settings.flash_url, '" />',
				'<param name="bgcolor" value="', this.settings.flash_color, '" />',
				'<param name="quality" value="high" />',
				'<param name="menu" value="false" />',
				'<param name="wmode" value="', this.settings.flash_wmode ,'" />',
				'<param name="allowScriptAccess" value="always" />',
				'<param name="flashvars" value="' + this.getFlashVars() + '" />',
				'</object>'].join("");
};

// Private: getFlashVars builds the parameter string that will be passed
// to flash in the flashvars param.
SWFUpload.prototype.getFlashVars = function () {
	// Build a string from the post param object
	var paramString = this.buildParamString();

	// Build the parameter string
	return ["movieName=", encodeURIComponent(this.movieName),
			"&amp;uploadURL=", encodeURIComponent(this.settings.upload_url),
			"&amp;useQueryString=", encodeURIComponent(this.settings.use_query_string),
			"&amp;requeueOnError=", encodeURIComponent(this.settings.requeue_on_error),
			"&amp;params=", encodeURIComponent(paramString),
			"&amp;filePostName=", encodeURIComponent(this.settings.file_post_name),
			"&amp;fileTypes=", encodeURIComponent(this.settings.file_types),
			"&amp;fileTypesDescription=", encodeURIComponent(this.settings.file_types_description),
			"&amp;fileSizeLimit=", encodeURIComponent(this.settings.file_size_limit),
			"&amp;fileUploadLimit=", encodeURIComponent(this.settings.file_upload_limit),
			//"&amp;fileQueueLimit=", encodeURIComponent(this.settings.file_queue_limit),
			//"&amp;buttonImage_url=", encodeURIComponent(this.settings.button_image_url),
			//"&amp;buttonWidth=", encodeURIComponent(this.settings.button_width),
			//"&amp;buttonHeight=", encodeURIComponent(this.settings.button_height),
			//"&amp;buttonText=", encodeURIComponent(this.settings.button_text),
			//"&amp;buttonTextStyle=", encodeURIComponent(this.settings.button_text_style),
			//"&amp;buttonAction=", encodeURIComponent(this.settings.button_action),
			//"&amp;buttonDisabled=", encodeURIComponent(this.settings.button_disabled)
		].join("");
};

// Public: getMovieElement retrieves the DOM reference to the Flash element added by SWFUpload
// The element is cached after the first lookup
SWFUpload.prototype.getMovieElement = function () {
	if (this.movieElement == undefined) {
		this.movieElement = document.getElementById(this.movieName);
	}

	if (this.movieElement === null) {
		throw "Could not find Flash element";
	}
	
	return this.movieElement;
};

// Private: buildParamString takes the name/value pairs in the post_params setting object
// and joins them up in to a string formatted "name=value&amp;name=value"
SWFUpload.prototype.buildParamString = function () {
	var postParams = this.settings.post_params;
	var paramStringPairs = [];

	if (typeof(postParams) === "object") {
		for (var name in postParams) {
			if (postParams.hasOwnProperty(name)) {
				paramStringPairs.push(encodeURIComponent(name.toString()) + "=" + encodeURIComponent(postParams[name].toString()));
			}
		}
	}

	return paramStringPairs.join("&amp;");
};

// Public: Used to remove a SWFUpload instance from the page. This method strives to remove
// all references to the SWF, and other objects so memory is properly freed.
// Returns true if everything was destroyed. Returns a false if a failure occurs leaving SWFUpload in an inconsistant state.
SWFUpload.prototype.destroy = function () {
	try {
		// Make sure Flash is done before we try to remove it
		this.stopUpload();
		
		// Remove the SWFUpload DOM nodes
		var movieElement = null;
		try {
			movieElement = this.getMovieElement();
		} catch (ex) {
		}
		
		if (movieElement != undefined && movieElement.parentNode != undefined && typeof(movieElement.parentNode.removeChild) === "function") {
			var container = movieElement.parentNode;
			if (container != undefined) {
				container.removeChild(movieElement);
				if (container.parentNode != undefined && typeof(container.parentNode.removeChild) === "function") {
					container.parentNode.removeChild(container);
				}
			}
		}
		
		// Destroy references
		SWFUpload.instances[this.movieName] = null;
		delete SWFUpload.instances[this.movieName];

		delete this.movieElement;
		delete this.settings;
		delete this.customSettings;
		delete this.eventQueue;
		delete this.movieName;
		
		return true;
	} catch (ex1) {
		return false;
	}
};

// Public: displayDebugInfo prints out settings and configuration
// information about this SWFUpload instance.
// This function (and any references to it) can be deleted when placing
// SWFUpload in production.
SWFUpload.prototype.displayDebugInfo = function () {
	this.debug(
		[
			"---SWFUpload Instance Info---\n",
			"Version: ", SWFUpload.version, "\n",
			"Movie Name: ", this.movieName, "\n",
			"Settings:\n",
			"\t", "upload_url:             ", this.settings.upload_url, "\n",
			"\t", "use_query_string:       ", this.settings.use_query_string.toString(), "\n",
			"\t", "file_post_name:         ", this.settings.file_post_name, "\n",
			"\t", "post_params:            ", this.settings.post_params.toString(), "\n",
			"\t", "file_types:             ", this.settings.file_types, "\n",
			"\t", "file_types_description: ", this.settings.file_types_description, "\n",
			"\t", "file_size_limit:        ", this.settings.file_size_limit, "\n",
			"\t", "file_upload_limit:      ", this.settings.file_upload_limit, "\n",
			"\t", "file_queue_limit:       ", this.settings.file_queue_limit, "\n",
			"\t", "flash_url:              ", this.settings.flash_url, "\n",
			"\t", "flash_color:            ", this.settings.flash_color, "\n",
			"\t", "debug:                  ", this.settings.debug.toString(), "\n",
			"\t", "custom_settings:        ", this.settings.custom_settings.toString(), "\n",
			"Event Handlers:\n",
			"\t", "swfupload_loaded_handler assigned:  ", (typeof(this.settings.swfupload_loaded_handler) === "function").toString(), "\n",
			"\t", "file_dialog_start_handler assigned: ", (typeof(this.settings.file_dialog_start_handler) === "function").toString(), "\n",
			"\t", "file_queued_handler assigned:       ", (typeof(this.settings.file_queued_handler) === "function").toString(), "\n",
			"\t", "file_queue_error_handler assigned:  ", (typeof(this.settings.file_queue_error_handler) === "function").toString(), "\n",
			"\t", "upload_start_handler assigned:      ", (typeof(this.settings.upload_start_handler) === "function").toString(), "\n",
			"\t", "upload_progress_handler assigned:   ", (typeof(this.settings.upload_progress_handler) === "function").toString(), "\n",
			"\t", "upload_error_handler assigned:      ", (typeof(this.settings.upload_error_handler) === "function").toString(), "\n",
			"\t", "upload_success_handler assigned:    ", (typeof(this.settings.upload_success_handler) === "function").toString(), "\n",
			"\t", "upload_complete_handler assigned:   ", (typeof(this.settings.upload_complete_handler) === "function").toString(), "\n",
			"\t", "debug_handler assigned:             ", (typeof(this.settings.debug_handler) === "function").toString(), "\n"
		].join("")
	);
};

/* Note: addSetting and getSetting are no longer used by SWFUpload but are included
	the maintain v2 API compatibility
*/
// Public: (Deprecated) addSetting adds a setting value. If the value given is undefined or null then the default_value is used.
SWFUpload.prototype.addSetting = function (name, value, default_value) {
    if (value == undefined) {
        return (this.settings[name] = default_value);
    } else {
        return (this.settings[name] = value);
	}
};

// Public: (Deprecated) getSetting gets a setting. Returns an empty string if the setting was not found.
SWFUpload.prototype.getSetting = function (name) {
    if (this.settings[name] != undefined) {
        return this.settings[name];
	}

    return "";
};



// Private: callFlash handles function calls made to the Flash element.
// Calls are made with a setTimeout for some functions to work around
// bugs in the ExternalInterface library.
SWFUpload.prototype.callFlash = function (functionName, argumentArray) {
	argumentArray = argumentArray || [];
	
	var self = this;
	var callFunction = function () {
		var movieElement = self.getMovieElement();
		var returnValue;
		if (typeof(movieElement[functionName]) === "function") {
			// We have to go through all this if/else stuff because the Flash functions don't have apply() and only accept the exact number of arguments.
			if (argumentArray.length === 0) {
				returnValue = movieElement[functionName]();
			} else if (argumentArray.length === 1) {
				returnValue = movieElement[functionName](argumentArray[0]);
			} else if (argumentArray.length === 2) {
				returnValue = movieElement[functionName](argumentArray[0], argumentArray[1]);
			} else if (argumentArray.length === 3) {
				returnValue = movieElement[functionName](argumentArray[0], argumentArray[1], argumentArray[2]);
			} else {
				throw "Too many arguments";
			}
			
			// Unescape file post param values
			if (returnValue != undefined && typeof(returnValue.post) === "object") {
				returnValue = self.unescapeFilePostParams(returnValue);
			}
			
			return returnValue;
		} else {
			throw "Invalid function name";
		}
	};
	
	return callFunction();
};


/* *****************************
	-- Flash control methods --
	Your UI should use these
	to operate SWFUpload
   ***************************** */

// Public: selectFile causes a File Selection Dialog window to appear.  This
// dialog only allows 1 file to be selected. WARNING: this function does not work in Flash Player 10
SWFUpload.prototype.selectFile = function () {
	this.callFlash("SelectFile");
};

// Public: selectFiles causes a File Selection Dialog window to appear/ This
// dialog allows the user to select any number of files
// Flash Bug Warning: Flash limits the number of selectable files based on the combined length of the file names.
// If the selection name length is too long the dialog will fail in an unpredictable manner.  There is no work-around
// for this bug.  WARNING: this function does not work in Flash Player 10
SWFUpload.prototype.selectFiles = function () {
	this.callFlash("SelectFiles");
};


// Public: startUpload starts uploading the first file in the queue unless
// the optional parameter 'fileID' specifies the ID 
SWFUpload.prototype.startUpload = function (fileID) {
	this.callFlash("StartUpload", [fileID]);
};

/* Cancels a the file upload.  You must specify a file_id */
// Public: cancelUpload cancels any queued file.  The fileID parameter
// must be specified.
SWFUpload.prototype.cancelUpload = function (fileID) {
	this.callFlash("CancelUpload", [fileID]);
};

// Public: stopUpload stops the current upload and requeues the file at the beginning of the queue.
// If nothing is currently uploading then nothing happens.
SWFUpload.prototype.stopUpload = function () {
	this.callFlash("StopUpload");
};

/* ************************
 * Settings methods
 *   These methods change the SWFUpload settings.
 *   SWFUpload settings should not be changed directly on the settings object
 *   since many of the settings need to be passed to Flash in order to take
 *   effect.
 * *********************** */

// Public: getStats gets the file statistics object.
SWFUpload.prototype.getStats = function () {
	return this.callFlash("GetStats");
};

// Public: setStats changes the SWFUpload statistics.  You shouldn't need to 
// change the statistics but you can.  Changing the statistics does not
// affect SWFUpload accept for the successful_uploads count which is used
// by the upload_limit setting to determine how many files the user may upload.
SWFUpload.prototype.setStats = function (statsObject) {
	this.callFlash("SetStats", [statsObject]);
};

// Public: getFile retrieves a File object by ID or Index.  If the file is
// not found then 'null' is returned.
SWFUpload.prototype.getFile = function (fileID) {
	if (typeof(fileID) === "number") {
		return this.callFlash("GetFileByIndex", [fileID]);
	} else {
		return this.callFlash("GetFile", [fileID]);
	}
};

// Public: addFileParam sets a name/value pair that will be posted with the
// file specified by the Files ID.  If the name already exists then the
// exiting value will be overwritten.
SWFUpload.prototype.addFileParam = function (fileID, name, value) {
	return this.callFlash("AddFileParam", [fileID, name, value]);
};

// Public: removeFileParam removes a previously set (by addFileParam) name/value
// pair from the specified file.
SWFUpload.prototype.removeFileParam = function (fileID, name) {
	this.callFlash("RemoveFileParam", [fileID, name]);
};

// Public: setUploadUrl changes the upload_url setting.
SWFUpload.prototype.setUploadURL = function (url) {
	this.settings.upload_url = url.toString();
	this.callFlash("SetUploadURL", [url]);
};

// Public: setPostParams changes the post_params setting
SWFUpload.prototype.setPostParams = function (paramsObject) {
	this.settings.post_params = paramsObject;
	this.callFlash("SetPostParams", [paramsObject]);
};

// Public: addPostParam adds post name/value pair.  Each name can have only one value.
SWFUpload.prototype.addPostParam = function (name, value) {
	this.settings.post_params[name] = value;
	this.callFlash("SetPostParams", [this.settings.post_params]);
};

// Public: removePostParam deletes post name/value pair.
SWFUpload.prototype.removePostParam = function (name) {
	delete this.settings.post_params[name];
	this.callFlash("SetPostParams", [this.settings.post_params]);
};

// Public: setFileTypes changes the file_types setting and the file_types_description setting
SWFUpload.prototype.setFileTypes = function (types, description) {
	this.settings.file_types = types;
	this.settings.file_types_description = description;
	this.callFlash("SetFileTypes", [types, description]);
};

// Public: setFileSizeLimit changes the file_size_limit setting
SWFUpload.prototype.setFileSizeLimit = function (fileSizeLimit) {
	this.settings.file_size_limit = fileSizeLimit;
	this.callFlash("SetFileSizeLimit", [fileSizeLimit]);
};

// Public: setFileUploadLimit changes the file_upload_limit setting
SWFUpload.prototype.setFileUploadLimit = function (fileUploadLimit) {
	this.settings.file_upload_limit = fileUploadLimit;
	this.callFlash("SetFileUploadLimit", [fileUploadLimit]);
};

// Public: setFileQueueLimit changes the file_queue_limit setting
SWFUpload.prototype.setFileQueueLimit = function (fileQueueLimit) {
	this.settings.file_queue_limit = fileQueueLimit;
	this.callFlash("SetFileQueueLimit", [fileQueueLimit]);
};

// Public: setFilePostName changes the file_post_name setting
SWFUpload.prototype.setFilePostName = function (filePostName) {
	this.settings.file_post_name = filePostName;
	this.callFlash("SetFilePostName", [filePostName]);
};

// Public: setUseQueryString changes the use_query_string setting
SWFUpload.prototype.setUseQueryString = function (useQueryString) {
	this.settings.use_query_string = useQueryString;
	this.callFlash("SetUseQueryString", [useQueryString]);
};

// Public: setRequeueOnError changes the requeue_on_error setting
SWFUpload.prototype.setRequeueOnError = function (requeueOnError) {
	this.settings.requeue_on_error = requeueOnError;
	this.callFlash("SetRequeueOnError", [requeueOnError]);
};

// Public: setDebugEnabled changes the debug_enabled setting
SWFUpload.prototype.setDebugEnabled = function (debugEnabled) {
	this.settings.debug_enabled = debugEnabled;
	this.callFlash("SetDebugEnabled", [debugEnabled]);
};

// Public: setButtonImageURL loads a button image sprite
SWFUpload.prototype.setButtonImageURL = function (buttonImageURL) {
	this.settings.button_image_url = buttonImageURL;
	this.callFlash("SetButtonImageURL", [buttonImageURL]);
};

// Public: setButtonDimensions resizes the Flash Movie and button
SWFUpload.prototype.setButtonDimensions = function (width, height) {
	this.settings.button_width = width;
	this.settings.button_height = height;
	
	// FIXME -- resize the movie
	
	this.callFlash("SetButtonDimensions", [width, height]);
};
// Public: setButtonText Changes the text overlaid on the button
SWFUpload.prototype.setButtonText = function (html) {
	this.settings.button_text= html;
	this.callFlash("SetButtonText", [html]);
};
// Public: setButtonTextStyle changes the CSS used to style the HTML/Text overlaid on the button
SWFUpload.prototype.setButtonTextStyle = function (css) {
	this.settings.button_text_style = css;
	this.callFlash("SetButtonTextStyle", [css]);
};
// Public: setButtonDisabled disables/enables the button
SWFUpload.prototype.setButtonDisabled = function (isDisabled) {
	this.settings.button_disabled = isDisabled;
	this.callFlash("SetButtonDisabled", [isDisabled]);
};
// Public: setButtonAction sets the action that occurs when the button is clicked
SWFUpload.prototype.setButtonAction = function (buttonAction) {
	this.settings.button_action = buttonAction;
	this.callFlash("SetButtonAction", [buttonAction]);
};

/* *******************************
	Flash Event Interfaces
	These functions are used by Flash to trigger the various
	events.
	
	All these functions a Private.
	
	Because the ExternalInterface library is buggy the event calls
	are added to a queue and the queue then executed by a setTimeout.
	This ensures that events are executed in a determinate order and that
	the ExternalInterface bugs are avoided.
******************************* */

SWFUpload.prototype.queueEvent = function (handlerName, argumentArray) {
	// Warning: Don't call this.debug inside here or you'll create an infinite loop
	
	if (argumentArray == undefined) {
		argumentArray = [];
	} else if (!(argumentArray instanceof Array)) {
		argumentArray = [argumentArray];
	}
	
	var self = this;
	if (typeof(this.settings[handlerName]) === "function") {
		// Queue the event
		this.eventQueue.push(function () {
			this.settings[handlerName].apply(this, argumentArray);
		});
		
		// Execute the next queued event
		setTimeout(function () {
			self.executeNextEvent();
		}, 0);
		
	} else if (this.settings[handlerName] !== null) {
		throw "Event handler " + handlerName + " is unknown or is not a function";
	}
};

// Private: Causes the next event in the queue to be executed.  Since events are queued using a setTimeout
// we must queue them in order to garentee that they are executed in order.
SWFUpload.prototype.executeNextEvent = function () {
	// Warning: Don't call this.debug inside here or you'll create an infinite loop

	var  f = this.eventQueue ? this.eventQueue.shift() : null;
	if (typeof(f) === "function") {
		f.apply(this);
	}
};

// Private: unescapeFileParams is part of a workaround for a flash bug where objects passed through ExternalInterfance cannot have
// properties that contain characters that are not valid for JavaScript identifiers. To work around this
// the Flash Component escapes the parameter names and we must unescape again before passing them along.
SWFUpload.prototype.unescapeFilePostParams = function (file) {
	var reg = /[$]([0-9a-f]{4})/i;
	var unescapedPost = {};
	var uk;

	if (file != undefined) {
		for (var k in file.post) {
			if (file.post.hasOwnProperty(k)) {
				uk = k;
				var match;
				while ((match = reg.exec(uk)) !== null) {
					uk = uk.replace(match[0], String.fromCharCode(parseInt("0x"+match[1], 16)));
				}
				unescapedPost[uk] = file.post[k];
			}
		}

		file.post = unescapedPost;
	}

	return file;
};

SWFUpload.prototype.flashReady = function () {
	// Check that the movie element is loaded correctly with its ExternalInterface methods defined
	var movieElement = this.getMovieElement();
	if (typeof(movieElement.StartUpload) !== "function") {
		throw "ExternalInterface methods failed to initialize.";
	}
	
	this.queueEvent("swfupload_loaded_handler");
};


/* This is a chance to do something before the browse window opens */
SWFUpload.prototype.fileDialogStart = function () {
	this.queueEvent("file_dialog_start_handler");
};


/* Called when a file is successfully added to the queue. */
SWFUpload.prototype.fileQueued = function (file) {
	file = this.unescapeFilePostParams(file);
	this.queueEvent("file_queued_handler", file);
};


/* Handle errors that occur when an attempt to queue a file fails. */
SWFUpload.prototype.fileQueueError = function (file, errorCode, message) {
	file = this.unescapeFilePostParams(file);
	this.queueEvent("file_queue_error_handler", [file, errorCode, message]);
};

/* Called after the file dialog has closed and the selected files have been queued.
	You could call startUpload here if you want the queued files to begin uploading immediately. */
SWFUpload.prototype.fileDialogComplete = function (numFilesSelected, numFilesQueued) {
	this.queueEvent("file_dialog_complete_handler", [numFilesSelected, numFilesQueued]);
};

SWFUpload.prototype.uploadStart = function (file) {
	file = this.unescapeFilePostParams(file);
	this.queueEvent("return_upload_start_handler", file);
};

SWFUpload.prototype.returnUploadStart = function (file) {
	var returnValue;
	if (typeof(this.settings.upload_start_handler) === "function") {
		file = this.unescapeFilePostParams(file);
		returnValue = this.settings.upload_start_handler.call(this, file);
	} else if (this.settings.upload_start_handler != undefined) {
		throw "upload_start_handler must be a function";
	}

	// Convert undefined to true so if nothing is returned from the upload_start_handler it is
	// interpretted as 'true'.
	if (returnValue === undefined) {
		returnValue = true;
	}
	
	returnValue = !!returnValue;
	
	this.callFlash("ReturnUploadStart", [returnValue]);
};



SWFUpload.prototype.uploadProgress = function (file, bytesComplete, bytesTotal) {
	file = this.unescapeFilePostParams(file);
	this.queueEvent("upload_progress_handler", [file, bytesComplete, bytesTotal]);
};

SWFUpload.prototype.uploadError = function (file, errorCode, message) {
	file = this.unescapeFilePostParams(file);
	this.queueEvent("upload_error_handler", [file, errorCode, message]);
};

SWFUpload.prototype.uploadSuccess = function (file, serverData) {
	file = this.unescapeFilePostParams(file);
	this.queueEvent("upload_success_handler", [file, serverData]);
};

SWFUpload.prototype.uploadComplete = function (file) {
	file = this.unescapeFilePostParams(file);
	this.queueEvent("upload_complete_handler", file);
};

/* Called by SWFUpload JavaScript and Flash functions when debug is enabled. By default it writes messages to the
   internal debug console.  You can override this event and have messages written where you want. */
SWFUpload.prototype.debug = function (message) {
	this.queueEvent("debug_handler", message);
};


/* **********************************
	Debug Console
	The debug console is a self contained, in page location
	for debug message to be sent.  The Debug Console adds
	itself to the body if necessary.

	The console is automatically scrolled as messages appear.
	
	If you are using your own debug handler or when you deploy to production and
	have debug disabled you can remove these functions to reduce the file size
	and complexity.
********************************** */
   
// Private: debugMessage is the default debug_handler.  If you want to print debug messages
// call the debug() function.  When overriding the function your own function should
// check to see if the debug setting is true before outputting debug information.
SWFUpload.prototype.debugMessage = function (message) {
	if (this.settings.debug) {
		var exceptionMessage, exceptionValues = [];

		// Check for an exception object and print it nicely
		if (typeof(message) === "object" && typeof(message.name) === "string" && typeof(message.message) === "string") {
			for (var key in message) {
				if (message.hasOwnProperty(key)) {
					exceptionValues.push(key + ": " + message[key]);
				}
			}
			exceptionMessage = exceptionValues.join("\n") || "";
			exceptionValues = exceptionMessage.split("\n");
			exceptionMessage = "EXCEPTION: " + exceptionValues.join("\nEXCEPTION: ");
			SWFUpload.Console.writeLine(exceptionMessage);
		} else {
			SWFUpload.Console.writeLine(message);
		}
	}
};

SWFUpload.Console = {};
SWFUpload.Console.writeLine = function (message) {
	var console, documentForm;

	try {
		console = document.getElementById("SWFUpload_Console");

		if (!console) {
			documentForm = document.createElement("form");
			document.getElementsByTagName("body")[0].appendChild(documentForm);

			console = document.createElement("textarea");
			console.id = "SWFUpload_Console";
			console.style.fontFamily = "proxima-nova";
			console.style.color = "white";
			console.setAttribute("wrap", "off");
			console.wrap = "off";
			console.style.overflow = "auto";
			console.style.width = "700px";
			console.style.height = "350px";
			console.style.margin = "5px";
			documentForm.appendChild(console);
		}

		console.value += message + "\n";

		console.scrollTop = console.scrollHeight - console.clientHeight;
	} catch (ex) {
		alert("Exception: " + ex.name + " Message: " + ex.message);
	}
};


/*
	SWFUpload.SWFObject Plugin

	Summary:
		This plugin uses SWFObject to embed SWFUpload dynamically in the page.  SWFObject provides accurate Flash Player detection and DOM Ready loading.
		This plugin replaces the Graceful Degradation plugin.

	Features:
		* swfupload_load_failed_hander event
		* swfupload_pre_load_handler event
		* minimum_flash_version setting (default: "9.0.28")
		* SWFUpload.onload event for early loading

	Usage:
		Provide handlers and settings as needed.  When using the SWFUpload.SWFObject plugin you should initialize SWFUploading
		in SWFUpload.onload rather than in window.onload.  When initialized this way SWFUpload can load earlier preventing the UI flicker
		that was seen using the Graceful Degradation plugin.

		<script type="text/javascript">
			var swfu;
			SWFUpload.onload = function () {
				swfu = new SWFUpload({
					minimum_flash_version: "9.0.28",
					swfupload_pre_load_handler: swfuploadPreLoad,
					swfupload_load_failed_handler: swfuploadLoadFailed
				});
			};
		</script>
		
	Notes:
		You must provide set minimum_flash_version setting to "8" if you are using SWFUpload for Flash Player 8.
		The swfuploadLoadFailed event is only fired if the minimum version of Flash Player is not met.  Other issues such as missing SWF files, browser bugs
		 or corrupt Flash Player installations will not trigger this event.
		The swfuploadPreLoad event is fired as soon as the minimum version of Flash Player is found.  It does not wait for SWFUpload to load and can
		 be used to prepare the SWFUploadUI and hide alternate content.
		swfobject's onDomReady event is cross-browser safe but will default to the window.onload event when DOMReady is not supported by the browser.
		 Early DOM Loading is supported in major modern browsers but cannot be guaranteed for every browser ever made.
*/

/* SWFObject v2.1 <http://code.google.com/p/swfobject/>
	Copyright (c) 2007-2008 Geoff Stearns, Michael Williams, and Bobby van der Sluis
	This software is released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
*/
var swfobject=function(){var b="undefined",Q="object",n="Shockwave Flash",p="ShockwaveFlash.ShockwaveFlash",P="application/x-shockwave-flash",m="SWFObjectExprInst",j=window,K=document,T=navigator,o=[],N=[],i=[],d=[],J,Z=null,M=null,l=null,e=false,A=false;var h=function(){var v=typeof K.getElementById!=b&&typeof K.getElementsByTagName!=b&&typeof K.createElement!=b,AC=[0,0,0],x=null;if(typeof T.plugins!=b&&typeof T.plugins[n]==Q){x=T.plugins[n].description;if(x&&!(typeof T.mimeTypes!=b&&T.mimeTypes[P]&&!T.mimeTypes[P].enabledPlugin)){x=x.replace(/^.*\s+(\S+\s+\S+$)/,"$1");AC[0]=parseInt(x.replace(/^(.*)\..*$/,"$1"),10);AC[1]=parseInt(x.replace(/^.*\.(.*)\s.*$/,"$1"),10);AC[2]=/r/.test(x)?parseInt(x.replace(/^.*r(.*)$/,"$1"),10):0}}else{if(typeof j.ActiveXObject!=b){var y=null,AB=false;try{y=new ActiveXObject(p+".7")}catch(t){try{y=new ActiveXObject(p+".6");AC=[6,0,21];y.AllowScriptAccess="always"}catch(t){if(AC[0]==6){AB=true}}if(!AB){try{y=new ActiveXObject(p)}catch(t){}}}if(!AB&&y){try{x=y.GetVariable("$version");if(x){x=x.split(" ")[1].split(",");AC=[parseInt(x[0],10),parseInt(x[1],10),parseInt(x[2],10)]}}catch(t){}}}}var AD=T.userAgent.toLowerCase(),r=T.platform.toLowerCase(),AA=/webkit/.test(AD)?parseFloat(AD.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")):false,q=false,z=r?/win/.test(r):/win/.test(AD),w=r?/mac/.test(r):/mac/.test(AD);/*@cc_on q=true;@if(@_win32)z=true;@elif(@_mac)w=true;@end@*/return{w3cdom:v,pv:AC,webkit:AA,ie:q,win:z,mac:w}}();var L=function(){if(!h.w3cdom){return }f(H);if(h.ie&&h.win){try{K.write("<script id=__ie_ondomload defer=true src=//:><\/script>");J=C("__ie_ondomload");if(J){I(J,"onreadystatechange",S)}}catch(q){}}if(h.webkit&&typeof K.readyState!=b){Z=setInterval(function(){if(/loaded|complete/.test(K.readyState)){E()}},10)}if(typeof K.addEventListener!=b){K.addEventListener("DOMContentLoaded",E,null)}R(E)}();function S(){if(J.readyState=="complete"){J.parentNode.removeChild(J);E()}}function E(){if(e){return }if(h.ie&&h.win){var v=a("span");try{var u=K.getElementsByTagName("body")[0].appendChild(v);u.parentNode.removeChild(u)}catch(w){return }}e=true;if(Z){clearInterval(Z);Z=null}var q=o.length;for(var r=0;r<q;r++){o[r]()}}function f(q){if(e){q()}else{o[o.length]=q}}function R(r){if(typeof j.addEventListener!=b){j.addEventListener("load",r,false)}else{if(typeof K.addEventListener!=b){K.addEventListener("load",r,false)}else{if(typeof j.attachEvent!=b){I(j,"onload",r)}else{if(typeof j.onload=="function"){var q=j.onload;j.onload=function(){q();r()}}else{j.onload=r}}}}}function H(){var t=N.length;for(var q=0;q<t;q++){var u=N[q].id;if(h.pv[0]>0){var r=C(u);if(r){N[q].width=r.getAttribute("width")?r.getAttribute("width"):"0";N[q].height=r.getAttribute("height")?r.getAttribute("height"):"0";if(c(N[q].swfVersion)){if(h.webkit&&h.webkit<312){Y(r)}W(u,true)}else{if(N[q].expressInstall&&!A&&c("6.0.65")&&(h.win||h.mac)){k(N[q])}else{O(r)}}}}else{W(u,true)}}}function Y(t){var q=t.getElementsByTagName(Q)[0];if(q){var w=a("embed"),y=q.attributes;if(y){var v=y.length;for(var u=0;u<v;u++){if(y[u].nodeName=="DATA"){w.setAttribute("src",y[u].nodeValue)}else{w.setAttribute(y[u].nodeName,y[u].nodeValue)}}}var x=q.childNodes;if(x){var z=x.length;for(var r=0;r<z;r++){if(x[r].nodeType==1&&x[r].nodeName=="PARAM"){w.setAttribute(x[r].getAttribute("name"),x[r].getAttribute("value"))}}}t.parentNode.replaceChild(w,t)}}function k(w){A=true;var u=C(w.id);if(u){if(w.altContentId){var y=C(w.altContentId);if(y){M=y;l=w.altContentId}}else{M=G(u)}if(!(/%$/.test(w.width))&&parseInt(w.width,10)<310){w.width="310"}if(!(/%$/.test(w.height))&&parseInt(w.height,10)<137){w.height="137"}K.title=K.title.slice(0,47)+" - Flash Player Installation";var z=h.ie&&h.win?"ActiveX":"PlugIn",q=K.title,r="MMredirectURL="+j.location+"&MMplayerType="+z+"&MMdoctitle="+q,x=w.id;if(h.ie&&h.win&&u.readyState!=4){var t=a("div");x+="SWFObjectNew";t.setAttribute("id",x);u.parentNode.insertBefore(t,u);u.style.display="none";var v=function(){u.parentNode.removeChild(u)};I(j,"onload",v)}U({data:w.expressInstall,id:m,width:w.width,height:w.height},{flashvars:r},x)}}function O(t){if(h.ie&&h.win&&t.readyState!=4){var r=a("div");t.parentNode.insertBefore(r,t);r.parentNode.replaceChild(G(t),r);t.style.display="none";var q=function(){t.parentNode.removeChild(t)};I(j,"onload",q)}else{t.parentNode.replaceChild(G(t),t)}}function G(v){var u=a("div");if(h.win&&h.ie){u.innerHTML=v.innerHTML}else{var r=v.getElementsByTagName(Q)[0];if(r){var w=r.childNodes;if(w){var q=w.length;for(var t=0;t<q;t++){if(!(w[t].nodeType==1&&w[t].nodeName=="PARAM")&&!(w[t].nodeType==8)){u.appendChild(w[t].cloneNode(true))}}}}}return u}function U(AG,AE,t){var q,v=C(t);if(v){if(typeof AG.id==b){AG.id=t}if(h.ie&&h.win){var AF="";for(var AB in AG){if(AG[AB]!=Object.prototype[AB]){if(AB.toLowerCase()=="data"){AE.movie=AG[AB]}else{if(AB.toLowerCase()=="styleclass"){AF+=' class="'+AG[AB]+'"'}else{if(AB.toLowerCase()!="classid"){AF+=" "+AB+'="'+AG[AB]+'"'}}}}}var AD="";for(var AA in AE){if(AE[AA]!=Object.prototype[AA]){AD+='<param name="'+AA+'" value="'+AE[AA]+'" />'}}v.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+AF+">"+AD+"</object>";i[i.length]=AG.id;q=C(AG.id)}else{if(h.webkit&&h.webkit<312){var AC=a("embed");AC.setAttribute("type",P);for(var z in AG){if(AG[z]!=Object.prototype[z]){if(z.toLowerCase()=="data"){AC.setAttribute("src",AG[z])}else{if(z.toLowerCase()=="styleclass"){AC.setAttribute("class",AG[z])}else{if(z.toLowerCase()!="classid"){AC.setAttribute(z,AG[z])}}}}}for(var y in AE){if(AE[y]!=Object.prototype[y]){if(y.toLowerCase()!="movie"){AC.setAttribute(y,AE[y])}}}v.parentNode.replaceChild(AC,v);q=AC}else{var u=a(Q);u.setAttribute("type",P);for(var x in AG){if(AG[x]!=Object.prototype[x]){if(x.toLowerCase()=="styleclass"){u.setAttribute("class",AG[x])}else{if(x.toLowerCase()!="classid"){u.setAttribute(x,AG[x])}}}}for(var w in AE){if(AE[w]!=Object.prototype[w]&&w.toLowerCase()!="movie"){F(u,w,AE[w])}}v.parentNode.replaceChild(u,v);q=u}}}return q}function F(t,q,r){var u=a("param");u.setAttribute("name",q);u.setAttribute("value",r);t.appendChild(u)}function X(r){var q=C(r);if(q&&(q.nodeName=="OBJECT"||q.nodeName=="EMBED")){if(h.ie&&h.win){if(q.readyState==4){B(r)}else{j.attachEvent("onload",function(){B(r)})}}else{q.parentNode.removeChild(q)}}}function B(t){var r=C(t);if(r){for(var q in r){if(typeof r[q]=="function"){r[q]=null}}r.parentNode.removeChild(r)}}function C(t){var q=null;try{q=K.getElementById(t)}catch(r){}return q}function a(q){return K.createElement(q)}function I(t,q,r){t.attachEvent(q,r);d[d.length]=[t,q,r]}function c(t){var r=h.pv,q=t.split(".");q[0]=parseInt(q[0],10);q[1]=parseInt(q[1],10)||0;q[2]=parseInt(q[2],10)||0;return(r[0]>q[0]||(r[0]==q[0]&&r[1]>q[1])||(r[0]==q[0]&&r[1]==q[1]&&r[2]>=q[2]))?true:false}function V(v,r){if(h.ie&&h.mac){return }var u=K.getElementsByTagName("head")[0],t=a("style");t.setAttribute("type","text/css");t.setAttribute("media","screen");if(!(h.ie&&h.win)&&typeof K.createTextNode!=b){t.appendChild(K.createTextNode(v+" {"+r+"}"))}u.appendChild(t);if(h.ie&&h.win&&typeof K.styleSheets!=b&&K.styleSheets.length>0){var q=K.styleSheets[K.styleSheets.length-1];if(typeof q.addRule==Q){q.addRule(v,r)}}}function W(t,q){var r=q?"visible":"hidden";if(e&&C(t)){C(t).style.visibility=r}else{V("#"+t,"visibility:"+r)}}function g(s){var r=/[\\\"<>\.;]/;var q=r.exec(s)!=null;return q?encodeURIComponent(s):s}var D=function(){if(h.ie&&h.win){window.attachEvent("onunload",function(){var w=d.length;for(var v=0;v<w;v++){d[v][0].detachEvent(d[v][1],d[v][2])}var t=i.length;for(var u=0;u<t;u++){X(i[u])}for(var r in h){h[r]=null}h=null;for(var q in swfobject){swfobject[q]=null}swfobject=null})}}();return{registerObject:function(u,q,t){if(!h.w3cdom||!u||!q){return }var r={};r.id=u;r.swfVersion=q;r.expressInstall=t?t:false;N[N.length]=r;W(u,false)},getObjectById:function(v){var q=null;if(h.w3cdom){var t=C(v);if(t){var u=t.getElementsByTagName(Q)[0];if(!u||(u&&typeof t.SetVariable!=b)){q=t}else{if(typeof u.SetVariable!=b){q=u}}}}return q},embedSWF:function(x,AE,AB,AD,q,w,r,z,AC){if(!h.w3cdom||!x||!AE||!AB||!AD||!q){return }AB+="";AD+="";if(c(q)){W(AE,false);var AA={};if(AC&&typeof AC===Q){for(var v in AC){if(AC[v]!=Object.prototype[v]){AA[v]=AC[v]}}}AA.data=x;AA.width=AB;AA.height=AD;var y={};if(z&&typeof z===Q){for(var u in z){if(z[u]!=Object.prototype[u]){y[u]=z[u]}}}if(r&&typeof r===Q){for(var t in r){if(r[t]!=Object.prototype[t]){if(typeof y.flashvars!=b){y.flashvars+="&"+t+"="+r[t]}else{y.flashvars=t+"="+r[t]}}}}f(function(){U(AA,y,AE);if(AA.id==AE){W(AE,true)}})}else{if(w&&!A&&c("6.0.65")&&(h.win||h.mac)){A=true;W(AE,false);f(function(){var AF={};AF.id=AF.altContentId=AE;AF.width=AB;AF.height=AD;AF.expressInstall=w;k(AF)})}}},getFlashPlayerVersion:function(){return{major:h.pv[0],minor:h.pv[1],release:h.pv[2]}},hasFlashPlayerVersion:c,createSWF:function(t,r,q){if(h.w3cdom){return U(t,r,q)}else{return undefined}},removeSWF:function(q){if(h.w3cdom){X(q)}},createCSS:function(r,q){if(h.w3cdom){V(r,q)}},addDomLoadEvent:f,addLoadEvent:R,getQueryParamValue:function(v){var u=K.location.search||K.location.hash;if(v==null){return g(u)}if(u){var t=u.substring(1).split("&");for(var r=0;r<t.length;r++){if(t[r].substring(0,t[r].indexOf("="))==v){return g(t[r].substring((t[r].indexOf("=")+1)))}}}return""},expressInstallCallback:function(){if(A&&M){var q=C(m);if(q){q.parentNode.replaceChild(M,q);if(l){W(l,true);if(h.ie&&h.win){M.style.display="block"}}M=null;l=null;A=false}}}}}();
	
var SWFUpload;
if (typeof(SWFUpload) === "function") {
	SWFUpload.onload = function () {};
	
	swfobject.addDomLoadEvent(function () {
		if (typeof(SWFUpload.onload) === "function") {
			SWFUpload.onload.call(window);
		}
	});
	
	SWFUpload.prototype.initSettings = (function (oldInitSettings) {
		return function () {
			if (typeof(oldInitSettings) === "function") {
				oldInitSettings.call(this);
			}

			this.ensureDefault = function (settingName, defaultValue) {
				this.settings[settingName] = (this.settings[settingName] == undefined) ? defaultValue : this.settings[settingName];
			};

			this.ensureDefault("minimum_flash_version", "9.0.28");
			this.ensureDefault("swfupload_load_failed_handler", null);

			delete this.ensureDefault;

		};
	})(SWFUpload.prototype.initSettings);


	SWFUpload.prototype.loadFlash = function (oldLoadFlash) {
		return function () {
			var hasFlash = swfobject.hasFlashPlayerVersion(this.settings.minimum_flash_version);
			
			if (hasFlash) {
				this.queueEvent("swfupload_pre_load_handler");
				if (typeof(oldLoadFlash) === "function") {
          oldLoadFlash.call(this);
				}
			} else {
				this.queueEvent("swfupload_load_failed_handler");
			}
		};
		
	}(SWFUpload.prototype.loadFlash);
			
	SWFUpload.prototype.displayDebugInfo = function (oldDisplayDebugInfo) {
		return function () {
			if (typeof(oldDisplayDebugInfo) === "function") {
				oldDisplayDebugInfo.call(this);
			}
			
			this.debug(
				[
					"SWFUpload.SWFObject Plugin settings:", "\n",
					"\t", "minimum_flash_version:                      ", this.settings.minimum_flash_version, "\n",
					"\t", "swfupload_load_failed_handler assigned:     ", (typeof(this.settings.swfupload_load_failed_handler) === "function").toString(), "\n",
				].join("")
			);
		};	
	}(SWFUpload.prototype.displayDebugInfo);
}

}


if (typeof(wistia) === 'undefined') {
/***********************
 *
 * WISTIA UPLOAD WIDGET
 *
 **********************/
(function() {
  var Wistia = function() {
    var uploadWidgetInstances = [];

    var jQueryScriptOutputted = false;
    var initJQuery = function() {
      if (typeof(jQuery) === 'undefined') {
        if (!jQueryScriptOutputted) {
          document.write('<scr' + 'ipt src="' + window.location.protocol + '//ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></scr' + 'ipt>');
          jQueryScriptOutputted = true;
        }
        setTimeout(initJQuery, 50);
      } else {
        if (jQueryScriptOutputted) {
          jQuery.noConflict();
        }

        // jquery.jsonp 2.4.0 (c)2012 Julian Aubourg | MIT License
        // https://github.com/jaubourg/jquery-jsonp
        (function(e){function t(){}function n(e){C=[e]}function r(e,t,n){return e&&e.apply&&e.apply(t.context||t,n)}function i(e){return/\?/.test(e)?"&":"?"}function O(c){function Y(e){z++||(W(),j&&(T[I]={s:[e]}),D&&(e=D.apply(c,[e])),r(O,c,[e,b,c]),r(_,c,[c,b]))}function Z(e){z++||(W(),j&&e!=w&&(T[I]=e),r(M,c,[c,e]),r(_,c,[c,e]))}c=e.extend({},k,c);var O=c.success,M=c.error,_=c.complete,D=c.dataFilter,P=c.callbackParameter,H=c.callback,B=c.cache,j=c.pageCache,F=c.charset,I=c.url,q=c.data,R=c.timeout,U,z=0,W=t,X,V,J,K,Q,G;return S&&S(function(e){e.done(O).fail(M),O=e.resolve,M=e.reject}).promise(c),c.abort=function(){!(z++)&&W()},r(c.beforeSend,c,[c])===!1||z?c:(I=I||u,q=q?typeof q=="string"?q:e.param(q,c.traditional):u,I+=q?i(I)+q:u,P&&(I+=i(I)+encodeURIComponent(P)+"=?"),!B&&!j&&(I+=i(I)+"_"+(new Date).getTime()+"="),I=I.replace(/=\?(&|$)/,"="+H+"$1"),j&&(U=T[I])?U.s?Y(U.s[0]):Z(U):(E[H]=n,K=e(y)[0],K.id=l+N++,F&&(K[o]=F),L&&L.version()<11.6?(Q=e(y)[0]).text="document.getElementById('"+K.id+"')."+p+"()":K[s]=s,A&&(K.htmlFor=K.id,K.event=h),K[d]=K[p]=K[v]=function(e){if(!K[m]||!/i/.test(K[m])){try{K[h]&&K[h]()}catch(t){}e=C,C=0,e?Y(e[0]):Z(a)}},K.src=I,W=function(e){G&&clearTimeout(G),K[v]=K[d]=K[p]=null,x[g](K),Q&&x[g](Q)},x[f](K,J=x.firstChild),Q&&x[f](Q,J),G=R>0&&setTimeout(function(){Z(w)},R)),c)}var s="async",o="charset",u="",a="error",f="insertBefore",l="_jqjsp",c="on",h=c+"click",p=c+a,d=c+"load",v=c+"readystatechange",m="readyState",g="removeChild",y="<script>",b="success",w="timeout",E=window,S=e.Deferred,x=e("head")[0]||document.documentElement,T={},N=0,C,k={callback:l,url:location.href},L=E.opera,A=!!e("<div>").html("<!--[if IE]><i><![endif]-->").find("i").length;O.setup=function(t){e.extend(k,t)},e.jsonp=O})(jQuery)

        // set the jQuery object for each of the existing uploadWidgetInstances
        for (var i = 0; i < uploadWidgetInstances.length; i++) {
          uploadWidgetInstances[i].jq = jQuery;
        }
      }
    };
    initJQuery();

    this.UploadWidget = function(o) {
      var self = this;
      uploadWidgetInstances.push(self);

      this.divId = o['divId'];
      this.publicProjectId = o['publicProjectId'];
      this.callbacks = o['callbacks'] || {};
      this.flashContainerId = o['divId'] + '_swfu';

      this.bytesLoaded = 0;
      this.lastBytesLoaded = 0;
      this.totalBytesLeft = 0;

      this.divSelector = '#' + o['divId'];

      // TODO: remove the dependency on jQuery altogether?
      this.jq = jQuery;

      var $upload_button;
      var $upload_status;
      var $progress_bar;
      var $progress_label;
      var $labels;
			var $cancel_button;
			var $time;

      // Keeps track of upload speed
      var MovingAverage = function(windowSize) {
        this.ary = [];

        this.push = function(val) {
          this.ary.push(val);
          if (this.ary.length > windowSize) { this.ary.shift(); }
        };

        this.getAverage = function() {
          return this.getTotal() / this.ary.length;
        };

        this.getTotal = function() {
          var total = 0;
          for (var i = 0; i < this.ary.length; i++) {
            total += this.ary[i];
          }
          return total;
        };
      };

      var uploadMovingAverage = new MovingAverage(50);

      this.createUploader = function(options) {
        var opts = {
          // Backend Settings
          upload_url: options.upload_url,
          post_params: {
            signature: options.signature,
            expires: options.expires
          },
          file_post_name: 'media[source_file]',

          // File Upload Settings
          file_size_limit: '2GB',
          file_types: '*.*',
          file_types_description: 'All Files',
          file_upload_limit: 0,
          file_queue_limit: 1,
          // Embed Settings
          minimum_flash_version: "9.0.28",

          // Event Handler Settings
          swfupload_load_failed_handler: self.loadFailed,
          swfupload_pre_load_handler: self.preLoad,
          swfupload_loaded_handler: self.loadSucceeded,

          file_queued_handler: self.fileQueued,
          file_queue_error_handler: self.fileQueueError,
          file_dialog_complete_handler: self.fileDialogComplete,
          upload_progress_handler: self.uploadProgress,
          upload_success_handler: self.uploadSuccess,
          upload_error_handler: self.uploadError,

          // Flash Settings
          //flash_url: "/flash/swfupload_f10.swf", // Relative to this file
          flash_url: options.flash_url,
          flash_container_id: self.flashContainerId,

          // Debug Settings
          debug: false,

          // Bakery params as custom settings
          custom_settings: {
            foreignId: options.foreign_id,
            createMediaUrl: options.create_media_url
          }
        };

        self.mediaGroupId = options.media_group_id;
        self.swfu = new SWFUpload(opts);
      };

      // Calls the appropriate callback if it exists.
      var notify = function(msg, args) {
        if (args && self.jq.isArray(args) == false) {
          args = [ args ];
        }

        if (self.callbacks[msg]) {
          self.callbacks[msg].apply(self, args);
        }
      };


      /*
       * UPLOAD SPEED CALCULATIONS
       */
      this.uploadSpeed = function() {
        return uploadMovingAverage.getAverage();
      };

      this.uploadSpeedInWords = function() {
        var speed = self.uploadSpeed();
        if (isNaN(speed)) { return '0 KB/s'; }
        else              { return Math.ceil(speed) + ' KB/s'; }
      };

      var sampleUploadSpeed = function() {
        if (!self.lastUpdateTime) { return; }
        var timeDelta = (self.updateTime - self.lastUpdateTime) / 1000;
        var bytesDelta = (self.bytesLoaded - self.lastBytesLoaded) / 1024;
        uploadMovingAverage.push(bytesDelta / timeDelta);
      };


      /*
       * TIME LEFT CALCULATIONS
       */
      this.totalTimeLeftInWords = function() {
        var seconds = ((self.totalBytesLeft / 1024) / self.uploadSpeed());
        if (isNaN(seconds)) {
          return 'Preparing file for upload';
        } else if (self.totalBytesLeft <= 0) {
          return 'Complete';
        } else if (seconds < 60) {
          return Math.ceil(seconds) + ' seconds remaining';
        } else if (seconds < 60*60) {
          var minutes = Math.ceil(seconds / 60);
          return 'about ' + minutes + ' minutes remaining';
        } else {
          var hours = Math.ceil(seconds / (60*60));
          return 'about ' + hours + ' hours remaining';
        }
      };


      /*
       * SWFUPLOAD CALLBACKS
       */
      this.fileDialogComplete = function() {
        self.swfu.startUpload();
      };

      this.fileQueued = function(fileObj) {
        // 'hide' the swfu flash object
        self.jq('#' + self.flashContainerId).css({ 'width': '1px' });
        self.foreignId = self.swfu.customSettings.foreignId + '+' + fileObj.id;

        // This used to be the Wistia.Upload.Item initialization code... sort of.
        self.totalBytesLeft = fileObj.size;
        self.fileObj = fileObj;

        $upload_button.fadeOut(200, function() {
					$time.show();
					$cancel_button.show();
					
          $upload_status.fadeIn(200, function() {
						self.updateStatus();
          });
        });

        self.swfu.addFileParam(fileObj.id, "media[foreign_id]", self.foreignId);

        notify('fileQueued', {
          'name': fileObj.name,
          'size': fileObj.size,
          'creationdate': fileObj.creationdate,
          'modificationdate': fileObj.modificationdate });
      };

      this.uploadProgress = function(fileObj, bytesLoaded) {
        self.lastBytesLoaded = self.bytesLoaded;
        self.lastUpdateTime = self.updateTime;
        self.bytesLoaded = bytesLoaded;
        self.updateTime = new Date().getTime();
        self.totalBytesLeft -= (bytesLoaded - self.lastBytesLoaded);

        sampleUploadSpeed();

        var percentComplete = (bytesLoaded / fileObj.size) * 100;
        $progress_bar.css({ width: percentComplete + '%' });
        $progress_label.html(Math.ceil(percentComplete) + '%');
        $progress_label.css({ "color": 'black'});
        self.updateStatus();

        notify('uploadProgress', [ bytesLoaded ]);
      };

      this.uploadSuccess = function(fileObj, serverData) {
        self.uploadProgress(self.fileObj, self.fileObj.size);
        $labels.html('Processing upload...');

				// hide the cancel button & time-left indicator
				$time.hide();
				$cancel_button.hide();

        self.jq.jsonp({
          cache: false,
          url: self.swfu.customSettings.createMediaUrl,
          callbackParameter: 'callback',
          data: {
            'media[foreign_id]': self.foreignId,
          media_group_id: self.mediaGroupId,
          position: 0 // Upload at position 0 for now... may need to parameterize this later.
          },
          success: function(obj, textStatus) {
                     notify('uploadSuccess', [ obj ]);
                     $labels.html('Your upload is finished');
                   },
          error: function(xOptions, textStatus) {
                   // textStatus: 'error' or 'timeout'
                   notify('postUploadFailure', textStatus);
                   self.fail();
                 },
          complete: function(xOptions, textStatus) {
                      // textStatus: 'success', 'error', or 'timeout'
                      notify('uploadComplete');

                      if (textStatus == 'success') {
                        $labels.html('Your upload is finished');
                      } else {
                        self.fail();
                      }
                    }
        });
      };

      this.fileQueueError = function(fileObj, errorCode, message) {
        var error = 'Upload queue error: ' + message;
        var code = 'FILE_QUEUE_ERROR';
        switch (errorCode) {
          case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
            code = 'FILE_TOO_BIG_ERROR';
            error = 'Cannot upload files exceeding ' + self.swfu.settings.file_size_limit + ' in size.';
            $upload_status.addClass('error').html('Error: ' + error);
            break;
          case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
            code = 'EMPTY_FILE_ERROR';
            error = 'Cannot upload an empty file.';
            $upload_status.addClass('error').html('Error: ' + error);
            break;
          case SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED:
          case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
          default:
            $upload_status.addClass('error').html(error);
            break;
        }

        notify('fileQueueError', { 'code': code, 'message': error, 'file': fileObj });
      };

      this.uploadError = function(fileObj, errorCode, message) {
        var error = 'Upload error: ' + message;
        var code = 'UPLOAD_ERROR';
        switch (errorCode) {
          case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:
            self.totalBytesLeft = 0;
            self.updateStatus();
            code = 'FILE_CANCELLED';
            break;
          case SWFUpload.UPLOAD_ERROR.IO_ERROR:
            code = 'IO_ERROR';
            error = 'Connection interrupted. This error may be caused by intermittent connection loss, local firewall software, or issues with your network configuration. Please try your upload again or contact Wistia at 888.494.7842 for assistance.';
            $upload_status.addClass('error').html(error);
            break;
          case SWFUpload.UPLOAD_ERROR.HTTP_ERROR:
            code = 'HTTP_ERROR';
            self.fail();
            break;
          case SWFUpload.UPLOAD_ERROR.UPLOAD_FAILED:
            code = 'UPLOAD_FAILED';
            self.fail();
            break;
          case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
            code = 'UPLOAD_STOPPED';
            self.fail();
            break;
          case SWFUpload.UPLOAD_ERROR.MISSING_UPLOAD_URL:
          case SWFUpload.UPLOAD_ERROR.SECURITY_ERROR:
          case SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:
          case SWFUpload.UPLOAD_ERROR.SPECIFIED_FILE_ID_NOT_FOUND:
          case SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED:
          default:
            $upload_status.addClass('error').html(error);
            break;
        }

        notify('uploadError', { 'code': code, 'message': error, 'file': fileObj });
      };

      // handlers for loading the swfu SWFUpload object.
      this.loadFailed = function() {
        self.jq('#' + self.flashContainerId).hide();
      };
      this.preLoad = function() {};
      this.loadSucceeded = function() {};

      /*
       * MISC
       */
      this.updateStatus = function() {
        $upload_status.find('.time-left').html(self.totalTimeLeftInWords());
        $upload_status.find('.upload-speed').html(self.uploadSpeedInWords());
      };

      this.cancelUpload = function() {
        if (self.fileObj) {
          self.swfu.cancelUpload(self.fileObj.id);
        }
      };

      this.fail = function() {
        notify('uploadFailed');

        self.jq(self.divSelector + ' .media').addClass('failed').find('.progress span').html('Upload failed');
        self.totalBytesLeft = (self.fileObj.size - self.bytesLoaded);
        self.updateStatus();
      };

      this.reset = function() {
        self.jq('#' + self.flashContainerId).css({ 'width': '100%' });
        self.totalBytesLeft = 0;
        self.bytesLoaded = 0;
        self.lastBytesLoaded = 0;
        $upload_status.removeClass('error');

        uploadMovingAverage = new MovingAverage(50);

        $upload_status.fadeOut(200, function() {
          $upload_button.fadeIn(200, function() {
            self.updateStatus();
          });
        });
      };

      /*
       * INITIALIZATION
       */
      this.initializeDom = function(staticHost) {
        var $uw = self.jq(self.divSelector);
        $uw.addClass('wistia-upload-widget');

        // if (self.jq('link.wistia-upload').size() == 0) {
        //   var cssHost = staticHost || window.location.protocol + '//static.wistia.com';
        //   var style = self.jq('<link class="wistia-upload" href="/assets/upload.css" rel="stylesheet"/>');
        //   // var style = self.jq('<link class="wistia-upload" href="' + staticHost + '/stylesheets/upload_widget.css" rel="stylesheet"/>');
        //   $uw.append(style);
        // }

        var buttonText = o['buttonText'] || 'Upload Content';
        $uw.append('<div class="upload-button"><a class="upload-media" href="#" style="line-height:' + $uw.height() + 'px">' + buttonText + '</a></div>');

        $uw.append('<div id="' + self.flashContainerId + '" class="swfu_container">&nbsp;</div>');
        $uw.append(
					'<div class="upload-status">' +
						'<div class="progress">' +
							'<div class="progress-bar" style="color:black"></div><span id="progress-bar">0%</span>' +
						'</div>' +
          	'<div class="time" style="color:black">' +
          		'<span class="time-left">Ready</span>' +
          		'<span class="upload-speed" style="color:black">0 KB/s</span>' +
          	'</div>' +
          	'<span class="cancel"><img src="assets/cancel_icon.png" height="20" width="20"> Cancel'+
          '</div>');

        $upload_button = self.jq(self.divSelector + ' .upload-button');
        $upload_status = self.jq(self.divSelector + ' .upload-status');
				$time = self.jq(self.divSelector + ' .time');
        $progress_bar = self.jq(self.divSelector + ' .progress-bar');
        $progress_label = self.jq(self.divSelector + ' .progress span');
				$cancel_button = $uw.find('.cancel');
				
        $labels = self.jq(self.divSelector + ' .progress span, ' + self.divSelector + ' .status-text');

				$cancel_button.click(function() { self.cancelUpload(); self.reset(); return false; });

        self.jq(self.divSelector + ' #' + self.flashContainerId).hover(function() {
          $upload_button.addClass('hover');
        }, function() {
          $upload_button.removeClass('hover');
        });
      };

      var getConfig = function() {
        if (self.jq && self.jq.jsonp) {
          var configHost = o['configHost'] || window.location.protocol + '//app.wistia.com';
          self.jq.jsonp({
            url: configHost + '/embed/upload/config.json',
            //url: 'assets/config.json',
            callbackParameter: 'callback',
            cache: false,
            data: { 'public_project_id': o['publicProjectId'] },
            success: function(obj, textStatus) {
              if (obj['error']) {
                notify('initializationError', obj['error']);
                self.jq(self.divSelector).html(obj['error']);
              } else {
                self.initializeDom(obj['static_host']);
                self.createUploader(obj);
                notify('initializationComplete');
              }
            },
            error: function(xOptions, textStatus) {
                     notify('initializationError');
                   }
          });
        } else {
          setTimeout(getConfig, 50);
        }
      };

      setTimeout(getConfig, 0);
    }; // UploadWidget
  }; // Wistia

  Wistia.prototype.jamCode = function(codeName, theCode) {
    if (typeof(this[codeName]) === 'undefined') {
      this[codeName] = theCode;
    }
  };

  window.wistia = new Wistia();

})();

}
