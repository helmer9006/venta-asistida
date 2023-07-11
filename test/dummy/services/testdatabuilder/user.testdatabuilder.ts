import { User } from '@prisma/client';

export class UserTestDataBuilder {
  userId: number;
  customerName: string;
  age: number;

  constructor() {
    this.userId = 1;
    this.customerName = 'Juanito';
    this.age = 90;
  }

  build(): User {
    const user: User = {
      age: this.age,
      customerName: this.customerName,
      userId: this.userId,
    };
    return user;
  }

  buildList(elements: number): User[] {
    const users: User[] = [];
    for (let x = 0; x < elements; x++) {
      users.push(this.build());
    }
    return users;
  }
}
