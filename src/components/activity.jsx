import React from "react";
import { format } from "date-fns";
import { Card, Typography } from "@material-ui/core";

//можно тогда совсем так пропсы получать, лучше единообразно, либо все вверху либо все потом
const Activity = ({ name, allocatedTimeslot: { begining, end  }}) => {
  const duration = `${format(begining, "hh:mm")}>${format(end, "hh:mm")}`;
  return (
    <Card
      // каждый рендер создается новый объект и перерендеривается компонент из-за этого. ну и везде дальше
      // Напишу тут, потом перенесу думал Ваня =)
      style={{
        margin: "8px",
        padding: "5px",
        whiteSpace: "nowrap",
        backgroundColor: "#43A047"
      }}
    >
      <Typography
        variant="caption"
        display="block"
        noWrap="true"
        align="left"
        // тут
        style={{ color: "rgba(255,255,255, 0.6)" }}
      >
        {duration}
      </Typography>
      <Typography
        variant="caption"
        display="block"
        noWrap="true"
        align="left"
        // тут
        style={{ color: "rgba(255,255,255, 1)" }}
      >
        {name}
      </Typography>
    </Card>
  );
};

export default Activity;
