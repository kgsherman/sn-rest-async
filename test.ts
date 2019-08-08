import SNAPI from './';

const sn = new SNAPI({
  instance: 'dev72041',
  username: 'admin',
  password: 'password'
});

(async function() {
  const records = await sn.getRecords('incident', {
    fields: ['number', 'short_description'],
    query: 'active=true',
    limit: 2
  });

  const record = await sn.getRecord('incident', '57af7aec73d423002728660c4cf6a71c', {
    fields: ['number', 'short_description']
  });

  console.log(records);

})();
