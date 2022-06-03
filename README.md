# typeorm-transactions
Create transactional decorator for DataSource(typeorm >= 3.0)

## Example

```
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string
}
```


```
import { DataSource, Entity } from 'typeorm';
import { factoryTransactionDecorator } from 'typeorm-transactions';
import { User } from './user.ts';

const appDataSource = new DataSource({
    ...
});

const Transactional = factoryTransactionDecorator(appDataSource);

@Injectable()
class UserService {

  @Transactional()
  async createUser(name: string) {
    const userRepository = appDataSource.getRepository(User);
    const newUser = userRepository.create({ name })

    await userRepository.save(newUser)

    return newUser
  }
}
```