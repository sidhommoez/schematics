import { ConnectionOptions, createConnection } from 'typeorm';
import { configService } from '../config/config.service';

async function run() {
  console.log('Beginning dbseed task.');

  const opt = {
    ...configService.getTypeOrmConfig(),
    debug: true
  };

  const connection = await createConnection(opt as ConnectionOptions);
  console.log('PG connected.');

  // const entitySeed = new EntitySeed(connection);

  // await entitySeed.run();
}

run()
  .then(a => console.log('...wait for script to exit'))
  .catch(error => console.error('seed error', error));
