// Create new file Sessions.js with the following content
cube(`Sessions`, {
    sql:
      `
      SELECT
        row_number() over(partition by event.actor order by event.time) || ' - '|| event.actor as session_id
        , event.actor
        , event.time as session_start_at
        , row_number() over(partition by event.actor order by event.time) as session_sequence
        , lead(time) over(partition by event.actor order by event.time) as next_session_start_at
      FROM
        (SELECT
          e.actor
          , e.time
          , EXTRACT(EPOCH FROM e.time - LAG(e.time) OVER(PARTITION BY e.actor ORDER BY e.time)) AS inactivity_time
         FROM ${Events.sql()} AS e
        ) as event
      WHERE (event.inactivity_time > 1800 OR event.inactivity_time is null)
      `
    ,
  measures: {
    count: {
      sql: `session_id`,
      type: `count`
    },

    averageDurationMinutes: {
        type: `avg`,
        sql: `${durationMinutes}`
      }
  },

  dimensions: {
        startAt: {
        sql: `session_start_at`,
        type: `time`
        },

        sessionID: {
        sql: `session_id`,
        type: `number`,
        primaryKey: true
        },
        numberEvents: {
            sql: `${Events.count}`,
            type: `number`,
            subQuery: true
          },
          
        endRaw: {
            sql: `${Events.lastEventTimestamp}`,
            type: `time`,
            subQuery: true,
            shown: false
          },
          
        //   endAt: {
        //     sql:
        //   `CASE WHEN ${endRaw} + INTERVAL '1 minutes' > ${CUBE}.next_session_start_at
        //        THEN ${CUBE}.next_session_start_at
        //        ELSE ${endRaw} + INTERVAL '30 minutes'
        //        END`,
        //     type: `time`
        //   },
          endAt: {
            sql:
          `CASE WHEN ${endRaw} + INTERVAL '1 minutes' > ${CUBE}.next_session_start_at
               THEN ${CUBE}.next_session_start_at
               ELSE ${endRaw} 
               END`,
            type: `time`
          },
          
          durationMinutes: {
               sql:  `EXTRACT(EPOCH FROM ${endAt} - ${CUBE}.session_start_at)/60`, 
        //     sql: `datediff(minutes, ${CUBE}.session_start_at, ${endAt})`,
            type: `number`
          }
    }
});