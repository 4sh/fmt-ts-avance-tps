import {Ageable, Genderable, Identifiable} from "./types";

console.log(`Hello world !`)

const aBool: boolean = true,
  aString: string = "Hello",
  aNum: number = 42;

interface IPerson {
  firstName: string,
  lastName: string,
}

type TPerson = {
  firstName: string,
  lastName: string
}

class Person {
  #age: number;
  constructor(private firstName: string, private lastName: string, age: number) {
    this.#age = age;
  }
}

let person: Person = new Person("Anders", "Hejlsberg", 63);
console.log(person);

// Un commentaire qui devrait disparaître
type TotalSizeOf = (str1: string, str2: string) => number;
const totalSizeOf: TotalSizeOf = (str1, str2) => str1.length + str2.length;

console.log(totalSizeOf("Hello", "world"));

type AgedPerson = IPerson & Ageable;
type IdentifiableGenderedPerson = TPerson & Identifiable & Genderable;

let agedPerson: AgedPerson = { firstName: "Anders", lastName: "Hejlsberg", age: 63 }
// agedPerson = person; // doesn't work, firstName/lastName are private, and age is missing in Person

// let person2: IPerson = person;
// person = person2;

let identifiableGenederedPerson: IdentifiableGenderedPerson = { id: "42", firstName: "Anders", lastName: "Hejlsberg" }
identifiableGenederedPerson.firstName = "Ryan" // OK
identifiableGenederedPerson.gender = "male" // OK
// identifiableGenederedPerson.id = "666" // KO, id is readonly
