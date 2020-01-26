import React from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from "@material-ui/core";
import Activity from "./activity";

// дальше видимо все в процессе с заглушками
// а для работы со временем крайне рекомендую moment.js
const dateString = "January 6, 2020";
const schedule = {
  date: new Date(dateString),
  //плак плак
  workingHours: [
    new Date(`${dateString} 8:00`),
    new Date(`${dateString} 9:00`),
    new Date(`${dateString} 10:00`),
    new Date(`${dateString} 11:00`),
    new Date(`${dateString} 12:00`),
    new Date(`${dateString} 13:00`),
    new Date(`${dateString} 14:00`),
    new Date(`${dateString} 15:00`),
    new Date(`${dateString} 16:00`),
    new Date(`${dateString} 17:00`),
    new Date(`${dateString} 18:00`),
    new Date(`${dateString} 19:00`),
    new Date(`${dateString} 20:00`),
    new Date(`${dateString} 21:00`)
  ],
  plannedActivities: [
    {
      id: 1,
      name: "Встреча",
      allocatedTimeslot: {
        begining: new Date(`${dateString} 08:00:00`),
        end: new Date(`${dateString} 09:00:00`)
      }
    },
    {
      id: 2,
      name: "Встреча",
      allocatedTimeslot: {
        begining: new Date(`${dateString} 09:00:00`),
        end: new Date(`${dateString} 09:30:00`)
      }
    },
    {
      id: 3,
      name: "Встреча",
      allocatedTimeslot: {
        begining: new Date(`${dateString} 09:30:00`),
        end: new Date(`${dateString} 09:45:00`)
      }
    },
    {
      id: 4,
      name: "Встреча с тестом",
      allocatedTimeslot: {
        begining: new Date(`${dateString} 10:45:00`),
        end: new Date(`${dateString} 11:30:00`)
      }
    }
  ]
};

const minutesInTimeslot = 15;

const style = {
  padding: "0",
  borderRight: "1px solid rgba(224, 224, 224, 1)"
};
const timeStyle = {
  width: "80px",
  borderRight: "1px solid rgba(224, 224, 224, 1)"
};

class Timeslot {
  constructor(begining, lengthInMintues) {
    this.begining = new Date(begining);
    this.end = new Date(begining);
    this.end.setMinutes(this.end.getMinutes() + lengthInMintues);
  }

  // не уверен но в моменте скорее всего это уже реализовано
  static checkIntersection(first, second) {
    return (
      (first.begining <= second.begining && second.begining < first.end) ||
      (first.begining < second.end && second.end <= first.end) ||
      (second.begining <= first.begining && first.begining < second.end) ||
      (second.begining < first.end && first.end <= second.end)
    );
  }
}

const getActivities = () => {
  return [...schedule.plannedActivities];
};

const mapTimeslots = (currentHour, activities) => {
  const timeslotsInHour = 60 / minutesInTimeslot;

 // тут не нужен let, потому что массив ты мутируешь а не переопределяешь, будет работать и с const
 // let mappedTimeslots = [];
  
  for (let i = 0; i < timeslotsInHour; i++) {
    let currentTimeslotStart = new Date(currentHour.begining);
    currentTimeslotStart.setMinutes(
      currentTimeslotStart.getMinutes() + minutesInTimeslot * i
    );
    const currentTimeslot = new Timeslot(
      currentTimeslotStart,
      minutesInTimeslot
    );

    const activityInTimeslot = filterActivities(activities, currentTimeslot)[0];
    if (!activityInTimeslot) {
      // скобочки лучше всегда ставить
      mappedTimeslots.push({ content: null, colspan: 1 });
    }
    else {
      // и переводы в моменте тоже есть
      let numberOfSlots =
        (activityInTimeslot.allocatedTimeslot.end - currentTimeslot.begining) /
        1000 /
        60 /
        minutesInTimeslot;
      if (numberOfSlots > timeslotsInHour - i)
        numberOfSlots = timeslotsInHour - i;

      mappedTimeslots.push({
        content: (
          <Activity
            // вместо этого можно использовать спред оператор, в данном случае он не оправдан
            // но если подобных пропсов будет в разы больше можно заменить эти строки на вот так
            // name={activityInTimeslot.name}
            // allocatedTimeslot={activityInTimeslot.allocatedTimeslot}
            {...activityInTimeslot}
          />
        ),
        colspan: numberOfSlots
      });
      // а вот это вообще очень странно, и потенциально может вызывать неимоверное количество ошибок
      // возможно стоит вначале проверять заполнена ли ячейка, и если да то переходить к следующей итерации,
      // а не самому выщитывать сколько перепрыгивать. (Если я вообще правильно понял что тут проихсодит)
      i += numberOfSlots - 1;
    }
  }

  return [
    {
      content: `${currentHour.begining.getHours()}:00`,
      colspan: 1
    },
    ...mappedTimeslots
  ];
};

const filterActivities = (activities, timeslot) => {
  return activities.filter(a => {
    return Timeslot.checkIntersection(a.allocatedTimeslot, timeslot);
  });
};

const createHourRows = hours => {
  
 // во-первых тут не нужен лет, потому что массив ты мутируешь а не переопределяешь, будет работать и с конст
 // let hourRows = [];
  
 // во вторых я бы его инициализацию переписал бы так:
  const hourRows = hours.map(item => {
    const currentHour = new Timeslot(item, 60);
    const activitiesThisHour = filterActivities(getActivities(), currentHour);
    console.log("Activities this hour:", activitiesThisHour);
    const hourRow = mapTimeslots(currentHour, activitiesThisHour);
    return hourRow;
  });

const Timetable = () => {
  const rows = createHourRows(schedule.workingHours);
  return (
    // стили не по стилю :D
    <Table style={{ tableLayout: "fixed", minWidth: "340px" }}>
      <TableHead/>
      <TableBody>
        {rows.map(row => (
          <TableRow key={row[0].content}>
            {row.map((cell, index) => (
              <TableCell
                // ставить index в key не самая хорошая идея,
                // потому что если ты список будешь изменять (вставлять/удалять элементы)
                // оно все будет очень не хорошо перерисовываться
                key={index}
                align="center"
                style={index === 0 ? timeStyle : style}
                colSpan={cell.colspan}
              >
                {cell.content || "Hey"}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default Timetable;
