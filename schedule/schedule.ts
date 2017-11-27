import * as Either from 'fp-ts/lib/Either';
import {Brand} from './adt';

type Chars50 = Brand<'Chars50', string>

type Person = {firstName: Chars50; lastName: Chars50}

type Instructor = Brand<'Instructor', Person>;

type Member = Brand<'Member', Person>;

type Guest = Brand<'Guest', Person>;

type Teacher =
  | {_tag: 'Instructor'} & Instructor
  | {_tag: 'Member'} & Member
  | {_tag: 'Guest'} & Guest

enum Classes {
  Hatha = 'Hatha',
  Vinyasa = 'Vinyasa',
  Iyengar = 'Iyengar',
  Kundalini = 'Kundalini',
  Restorative = 'Restorative',
}

enum Workshops {
  Intro = 'Intro',
  Chakra = 'Chakra',
  Inversions = 'Inversions',
}

type TimedEvent =
  {start: Date, end: Date}

type FullDayEvent =
  {date: Date}

type EventDuration =
  | {_tag: 'TimedEvent'} & TimedEvent
  | {_tag: 'FullDayEvent'} & FullDayEvent

type ScheduledClass =
  {_tag: 'ScheduledClass', instructor: Instructor, yogaClass: Classes} & {duration: TimedEvent}

type ScheduledWorkshop =
  {_tag: 'ScheduledWorkshop', teacher: Teacher, workshop: Workshops} & {duration: TimedEvent}

type MembersBirthday =
  {_tag: 'MembersBirthday', member: Member} & {duration: FullDayEvent}

type SpecialEvent =
  {_tag: 'SpecialEvent', description: string} & {duration: EventDuration}

type ScheduledEvent =
  | ScheduledClass
  | ScheduledWorkshop
  | MembersBirthday
  | SpecialEvent

const toChars50 = (chars: string): Either.Either<string, Chars50> => (
  chars.length > 50 || chars.length < 1
    ? Either.left('String must be between 1 and 50 characters.')
    : Either.right(chars as Chars50)
);

const toPerson = (firstName: string, lastName: string) => {
  const _toPerson = (firstName: Chars50) => (lastName: Chars50): Person => ({
    firstName,
    lastName,
  });
  return toChars50(firstName)
    .map(_toPerson)
    .ap_(toChars50(lastName))
    .mapLeft(_ => 'Couldn\'t create Person from names.');
};

const isDateTooEarly = (date: Date) =>
  date.getTime() < new Date('01/01/2016').getTime();

const toTimedEvent = (start: Date, end: Date): Either.Either<string, TimedEvent> => (
  isDateTooEarly(start) && start.getTime() >= end.getTime()
    ? Either.left('Invalid range given for TimedEvent.')
    : Either.right({_tag: 'TimedEvent', start, end})
);

const toFullDayEvent = (date: Date): Either.Either<string, FullDayEvent> => (
  isDateTooEarly(date)
    ? Either.left('Invalid date for FullDayEvent.')
    : Either.right({_tag: 'FullDayEvent', date})
);

const toInstructor = (person: Person): Instructor => (
  person as Instructor
);

const toMember = (person: Person): Member => (
  person as Member
);

const toGuest = (person: Person): Guest => (
  person as Guest
);

const toYogaClassType = (type: keyof typeof Classes): Either.Either<string, Classes> => (
  type in Classes
    ? Either.right(Classes[type])
    : Either.left(`Yoga Class not found: ${type}`)
);

const toWorkshopType = (type: keyof typeof Workshops): Either.Either<string, Workshops> => (
  type in Workshops
    ? Either.right(Workshops[type])
    : Either.left(`Yoga Workshop not found: ${type}`)
);

const toScheduledClass = (duration: TimedEvent, instructor: Instructor, yogaClass: Classes): ScheduledClass => ({
  _tag: 'ScheduledClass',
  duration,
  instructor,
  yogaClass,
});

const toScheduledWorkshop = (duration: TimedEvent, teacher: Teacher, workshop: Workshops): ScheduledWorkshop => ({
  _tag: 'ScheduledWorkshop',
  duration,
  teacher,
  workshop,
});

const toMembersBirthday = (duration: FullDayEvent, member: Member): MembersBirthday => ({
  _tag: 'MembersBirthday',
  duration,
  member,
});

const toSpecialEvent = (duration: EventDuration, description: string): SpecialEvent => ({
  _tag: 'SpecialEvent',
  description,
  duration,
});
