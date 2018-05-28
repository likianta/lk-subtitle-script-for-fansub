{
	// email_methods.jsx
	// 
	// This is generic code for talking to an email server.
	// 
	// This file is encoded in UTF-8.
	
	
	// Create an email object. The function may be called both
	// as a global function and as a constructor. It takes the
	// name of the email server, and an optional Boolean that,
	// if true, prints debugging messages.
	// This object is not guaranteed to work for all SMTP servers,
	// some of them may require a different set of commands.
	
	// functions:
	// send (fromAddress, toAddress, subject, text) - send an email
	// auth (name, pass) - do an authorization via POP3
	// both functions return false on errors
	
	// sample:
	// e = new EmailSocket ("mail.host.com");
	// authorize via POP3 (not all servers require authorization)
	// e.auth ("myname", "mypass");
	// send the email
	// e.send ("me@my.com", "you@you.com", "My Subject", "Hi there!")
	
	// This script makes use of the Socket object, and creates a new class
	// called EmailSocket that is derived from Socket. For more information on
	// creating new classes in this way, consult chapter 7 of JavaScript, The
	// Definitive Guide, by David Flanagan (O'Reilly).
	//
	// Version History:
	// V1 initial release
	// v2 - fix problems with bare linefeeds in the email that 
	//		caused it to be rejected by some servers. http://cr.yp.to/docs/smtplf.html
	// v3 - add support for the SMTP AUTH command. Only the LOGIN
	//	protocol is supported since it looks like all servers support
	//	it, while not all support PLAIN. Outlook Express 4.x and 5.x use
	//	LOGIN as there AUTH protocol.
	//	Also fix bug where EHLO sent a syntactically incorrect argument
	
	// This is the constructor for the email socket. It takes as arguments:
	// server - the address of the email server (is not checked for validity here)
	// dbg - a Boolean, if true, prints additional error information
	
	function EmailSocket(server, dbg)
	{
		var obj = new Socket;
		obj._host = server;
		obj._debug = (dbg == true);
		obj.__proto__ = EmailSocket.prototype;
		obj.headers = new Array();
		
		return obj;
	}
	
	
	// Correct the protoype chain to point to the Socket prototype chain
	// - this is what actually causes the derivation from Socket.
	
	EmailSocket.prototype.__proto__ = Socket.prototype;
	
	// This sets up the send() member function. send() takes as arguments:
	// from - the email address of the sender. This is not validated.
	// to - the email address of the recipient. If there is an error,
	// and the from address is incorrect, you will not be notified.
	// subject - the contents of the subject field.
	// text - the body of the message.
	// auth_user - OPTIONAL the username of the account to authorize with the smtp server
	// auth_password - OPTIONAL - the already base64 encoded password
	//
	// Returns: 
	// true if sending succeeded
	// THROWS AN ERROR STRING if the function fails.
	//
	// Note that this code uses a local function object to create
	// the function that is assigned to send.
	
	EmailSocket.prototype.send = function (from, to, subject, text, auth_user, auth_password) {
		// Open the socket on port 25 (SMTP).
		// Right now this is binary because otherwise the CRLF got reinterpreted and
		// my server would not accept it. We will need changes to the socket object
		// to fix correctly.
		if (!this.open(this._host + ":25", "binary")) {
			return false;
		}
		
		try {
			// Discard the greeting.
			var greeting = this.read();
			if (this._debug) {
				write("RECV: " + greeting);
			}
			
			// Issue EHLO and other commands.
			// One user is having a problem with the full email as the @ sign is illegal.
			// We should use the ip of the client http://cr.yp.to/smtp/helo.html#helo
			// but we can't get that with the socket object. Therefore we are using
			// the host portion of the reply to email address.
			var client_only = from.split("@")[1];
			
			this._SMTP("EHLO " + client_only);
			var response = this.read();
			
			if (auth_user) {
				// Now send the auth stuff.
				this._SMTP("AUTH LOGIN");
				this._SMTP(this._ENCODE_BASE_64(auth_user));
				this._SMTP(auth_password);
			}
			
			this._SMTP("MAIL FROM: " + from);
			this._SMTP("RCPT TO: " + to);
			this._SMTP("DATA");
			
			// Send subject and time stamp.
			this.writecrlfln("From: " + from);
			this.writecrlfln("To: " + to);
			this.writecrlfln("Date: " + new Date().toString());
			for (key in this.headers) {
				this.writecrlfln(key + ": " + this.headers[key]);
			}
			if (typeof subject != undefined) {
				this.writecrlfln ("Subject: " + subject);
			}
			this.writecrlfln();
			
			// Send the text.
			if (typeof text != undefined) {
				this.writecrlfln(text);
			}
			
			// Terminate with a single dot and wait for response.
			this._SMTP(".");
			
			// Terminate the session.
			this._SMTP("QUIT");
			this.close();
			
			return true;
		} catch (e) {
			this.close();
			throw e;
		}
	}
	
	
	// Authorize via POP3. Supply name and password.
	//
	// Returns: 
	// true if sending succeeded
	// false otherwise (if there was an error)
	//
	// Arguments:
	// name - the userName of the account
	// pass - the password
	
	EmailSocket.prototype.auth = function (name, pass) {
		// Open the connection on port 110 (POP3).
		if (!this.open(this._host + ":110")) {
			return false;
		}
		
		try {
			// Discard the greeting.
			var greeting = this.read();
			if (this._debug) {
				write("RECV: " + greeting);
			}
			
			// Issue POP3 commands.
			this._POP3("USER " + name);
			this._POP3("PASS " + pass);
			this._POP3("QUIT");
			this.close();
			
			return true;
		} catch (e) {
			this.close();
			return false;
		}
	}
	
	
	// Users of the EmailSocket do not need to be concerned with
	// the following method. It is an implementation helper.
	
	// Local function to send a command and check a POP3 reply.
	// Throws in case of error.
	EmailSocket.prototype._POP3 = function (cmd) {
		if (this._debug) {
			writeLn("SEND: " + cmd);
		}
		
		if (!this.writecrlfln(cmd)) {
			throw "Error";
		}
		
		var reply = this.read();
		if (this._debug) {
			write("RECV: " + reply);
		}
		
		// The reply starts by either + or -
		if (reply [0] == "+") {
			return;
		}
		
		throw "Error";
	}
	
	
	// Users of the EmailSocket do not need to be concerned with
	// the following method. It is an implementation helper.
	
	// Local function to send a command and check a SMTP reply.
	// Throws in case of error.
	EmailSocket.prototype._SMTP = function (cmd) {
		if (this._debug) {
			writeLn("SEND: " + cmd);
		}
		if (!this.writecrlfln(cmd)) {
			throw "Error";
		}
		
		var reply = this.read();
		if (this._debug) {
			write("RECV: " + reply);
		}
		
		// The reply is a three-digit code followed by a space.
		var match = reply.match(/^(\d{3})\s/m);
		if (match.length == 2) {
			var n = Number(match [1]);
			if (n >= 200 && n <= 399) {
				return;
			}
		}
		
		throw reply;
	}
	
	
	// Email can't contain bare linefeeds: http://cr.yp.to/docs/smtplf.html
	EmailSocket.prototype.writecrlfln = function (cmd) {
		if (cmd) {
			return this.write(cmd + "\r\n");
		} else {
			return this.write("\r\n");
		}
	}
	
	
	// This base64 encodes str. RFC-2045
	EmailSocket.prototype._ENCODE_BASE_64 = function(str) {
		var lut = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
		var chunk = 0;
		var result = "";
		
		for (var i = 0; i < str.length; i += 3) {
			chunk = str.charCodeAt(i) & 0xFF;
			chunk = chunk << 8;
			
			// Asking for a char out of range returns "".
			chunk |= str.charCodeAt(i+1) & 0xFF;
			chunk = chunk << 8;
			
			chunk |= str.charCodeAt(i+2) & 0xFF;
			
			// These are the number of gaps until we hit %3.
			var partialEnd = 3 - (str.length - i) ;
			var num6bits = 4;
			
			if (partialEnd == 2) { // one character encoded
				num6bits = 2;
			} else if (partialEnd == 1) { // two encoded
				num6bits = 3;
			}
			
			for (var j = 0; j < num6bits; j++) {
				result += lut.charAt((chunk & 0xFC0000) >> 18); // six bits	
				chunk = chunk << 6; 
			}	
			
			// Fill with = chars.
			if (partialEnd < 3) {
				for (var j = 0; j < partialEnd; j++) {
					result += "=";
				}
			}
		}
		
		return result;
	}
	
	
	// Nice to have: a toString()
	// This function allows the email object to be printed.
	
	EmailSocket.prototype.toString = function() {
		return "[object Email]";
	}
}
