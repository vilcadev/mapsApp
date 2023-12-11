const { writeFileSync, mkdirSync } = require('fs');

require('dotenv').config()


const targetPath ='./src/environments/environment.ts';

const envFileContent = `

  export const environment ={
    mapbox_key:"${ process.env['MAPBOX_KEY'] }",
  };
`;

// Creamos un directorio, y { recursive:true } quiere decir que si ya
// - existe lo vuelve a sobreescribir
mkdirSync('./src/environments',{ recursive:true });

writeFileSync( targetPath, envFileContent );
