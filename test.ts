import SNAPI from './';

const sn = new SNAPI({
  instance: 'dev72041',
  username: 'admin',
  password: 'password'
});

(async function() {


        const records = await sn.getRecords('incident', {
            fields: ['number', 'short_description'],
            limit: 2,
            query: 'active=true',
        });

        console.log(records);


})();
