module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Trouver un serveur",

//---------------------------------------------------------------------
// Action Section
//
// This is the section the action will fall into.
//---------------------------------------------------------------------

section: "Contrôle de serveur",

//---------------------------------------------------------------------
// Action Subtitle
//
// This function generates the subtitle displayed next to the name.
//---------------------------------------------------------------------

subtitle: function(data) {
	const info = ['ID du serveur', 'Nom du serveur', 'Acronyme du serveur', 'Nombre d\'utilis. du serveur', 'Region du serveur', 'ID du propriétaiare du serveur', 'Niveau de vérification du serveur', 'Serveur disponible'];
	return `Trouver le serveur avec ${info[parseInt(data.info)]}`;
},

//---------------------------------------------------------------------
// Action Storage Function
//
// Stores the relevant variable info for the editor.
//---------------------------------------------------------------------

variableStorage: function(data, varType) {
	const type = parseInt(data.storage);
	if(type !== varType) return;
	return ([data.varName, 'Server']);
},

//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["info", "find", "storage", "varName"],

//---------------------------------------------------------------------
// Command HTML
//
// This function returns a string containing the HTML used for
// editting actions. 
//
// The "isEvent" parameter will be true if this action is being used
// for an event. Due to their nature, events lack certain information, 
// so edit the HTML to reflect this.
//
// The "data" parameter stores constants for select elements to use. 
// Each is an array: index 0 for commands, index 1 for events.
// The names are: sendTargets, members, roles, channels, 
//                messages, servers, variables
//---------------------------------------------------------------------

html: function(isEvent, data) {
	return `
<div>
	<div style="float: left; width: 40%;">
		Champs source:<br>
		<select id="info" class="round">
			<option value="0" selected>ID du serveur</option>
			<option value="1">Nom du serveur</option>
			<option value="2">Acronyme du serveur</option>
			<option value="3">Nombre d'utilisateurs du serveur</option>
			<option value="4">Region du serveur</option>
			<option value="5">ID du propriétaire du serveur</option>
			<option value="6">Niveau de vérification du serveur</option>
			<option value="7">Serveur disponible</option>
		</select>
	</div>
	<div style="float: right; width: 55%;">
		Valeur à rechercher:<br>
		<input id="find" class="round" type="text">
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	<div style="float: left; width: 35%;">
		Stocker dans:<br>
		<select id="storage" class="round">
			${data.variables[1]}
		</select>
	</div>
	<div id="varNameContainer" style="float: right; width: 60%;">
		Nom de la variable:<br>
		<input id="varName" class="round" type="text">
	</div>
</div>`
},

//---------------------------------------------------------------------
// Action Editor Init Code
//
// When the HTML is first applied to the action editor, this code
// is also run. This helps add modifications or setup reactionary
// functions for the DOM elements.
//---------------------------------------------------------------------

init: function() {
},

//---------------------------------------------------------------------
// Action Bot Function
//
// This is the function for the action within the Bot's Action class.
// Keep in mind event calls won't have access to the "msg" parameter, 
// so be sure to provide checks for variable existance.
//---------------------------------------------------------------------

action: function(cache) {
	const bot = this.getDBM().Bot.bot;
	const servers = bot.guilds;
	const data = cache.actions[cache.index];
	const info = parseInt(data.info);
	const find = this.evalMessage(data.find, cache);
	let result;
	switch(info) {
		case 0:
			result = servers.find('id', find);
			break;
		case 1:
			result = servers.find('name', find);
			break;
		case 2:
			result = servers.find('nameAcronym', find);
			break;
		case 3:
			result = servers.find('memberCount', parseInt(find));
			break;
		case 4:
			result = servers.find('region', find);
			break;
		case 5:
			result = servers.find('ownerID', find);
			break;
		case 6:
			result = servers.find('verificationLevel', parseInt(find));
			break;
		case 7:
			result = servers.find('available', Boolean(find === 'true'));
			break;
		default:
			break;
	}
	if(result !== undefined) {
		const storage = parseInt(data.storage);
		const varName = this.evalMessage(data.varName, cache);
		this.storeValue(result, storage, varName, cache);
		this.callNextAction(cache);
	} else {
		this.callNextAction(cache);
	}
},

//---------------------------------------------------------------------
// Action Bot Mod
//
// Upon initialization of the bot, this code is run. Using the bot's
// DBM namespace, one can add/modify existing functions if necessary.
// In order to reduce conflictions between mods, be sure to alias
// functions you wish to overwrite.
//---------------------------------------------------------------------

mod: function(DBM) {
}

}; // End of module