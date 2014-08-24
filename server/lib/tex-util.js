module.exports = (function() {

  var command,
      slashLineBreak,
      replaceSpecialChars;

  command = function(name, arg, optionalArgs) {
    var command;

    command = '\\' + name;

    if (optionalArgs && optionalArgs.length > 0) {
      command += '[' + optionalArgs.join(',') + ']';
    } 

    if (arg) {
      command += '{' + arg + '}';
    }

    command += '\n';

    return command;
  };

  slashLineBreak = '\\\\';

  replaceSpecialChars = function(str) {
    str = str.replace( /\\/g, '\\textbackslash ');
    str = str.replace( /\|/g, '\\textbar ');
    str = str.replace( /\>/g, '\\textgreater ');
    str = str.replace( /\-/g, '\\textendash ');
    str = str.replace( /\</g, '\\textless ');
    str = str.replace( /\%/g, '\\%');
    str = str.replace( /\$/g, '\\$');
    str = str.replace( /\{/g, '\\{');
    str = str.replace( /\_/g, '\\_');
    str = str.replace( /\#/g, '\\#');
    str = str.replace( /\&/g, '\\&');
    str = str.replace( /\}/g, '\\}');
    return str;
  };

  return {
    command: command,
    slashLineBreak: slashLineBreak,
    replaceSpecialChars: replaceSpecialChars
  };

}());