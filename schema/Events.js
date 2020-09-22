cube(`Events`, {
  sql: `
        SELECT
          *,
          CAST(context ->> 'first-paint' AS INT) AS firstPaint,
          CAST(context ->> 'time-to-interactive' AS INT) AS timeToInteractive,
          CAST(context ->> 'page-loaded' AS INT) AS pageLoaded,
          CAST(context ->> 'downlink' AS FLOAT) AS downlink,
          CAST(context ->> 'response-start' AS INT) AS responseStart,
          CAST(context ->> 'response-end' AS INT) AS responseEnd,
          CAST(context ->> 'dom-interactive-time' AS INT) AS domInteractiveTime,
          CAST(context ->> 'dom-content-loaded' AS INT) AS domContentLoaded
        FROM 
          activity
       `,
  
  joins: {
    Sessions: {
      relationship: `belongsTo`,
      sql: `
        ${Events}.actor = ${Sessions}.actor
        AND ${Events}.time >= ${Sessions}.session_start_at
        AND (${Events}.time < ${Sessions}.next_session_start_at or ${Sessions}.next_session_start_at is null)
      `
    },
    Actor: {
      relationship: `hasOne`,
      sql: `
        ${Events}.actor = ${Actor}.insights_id
      `
    }
  },
  
  measures: {

    count: {
      type: `count`,
    //   drillMembers: [timestamp]
    },

    activeUsers: {
      sql: `actor`,
      type: `countDistinct`
    },

    monthlyActiveUsers: {
      sql: `actor`,
      type: `countDistinct`,
      rollingWindow: {
        trailing: `30 day`
      }
    },

    weeklyActiveUsers: {
      sql: `actor`,
      type: `countDistinct`,
      rollingWindow: {
        trailing: `1 week`
      }
    },

    dailyActiveUsers: {
      sql: `actor`,
      type: `countDistinct`,
      rollingWindow: {
        trailing: `1 day`
      }
    },

    dauToMau: {
      title: `DAU to MAU`,
      sql: `100.000 * ${dailyActiveUsers} / NULLIF(${monthlyActiveUsers}, 0)`,
      type: `number`,
      format: `percent`
    },

    lastEventTimestamp: {
      sql: `time`,
      type: `max`,
      shown: false
    } ,

    pageCount: {
      sql: `object`,
      type: `count`
    },

    pageCountUnique: {
      sql: `object`,
      type: `countDistinct`
    },

    // Performance

    AvgFirstPaint: {
      sql: `firstPaint`,
      type: `avg`
    },

    AvgTimeToInteractive: {
      sql: `timeToInteractive`,
      type: `avg`
    },

    AvgDownlink: {
      sql: `downlink`,
      type: `avg`
    },
    
    AvgPageLoaded: { 
      sql: `pageLoaded`,
      type: `avg`
    },

    AvgResponseStart: {
      sql: `responseStart`,
      type: `avg`
    },

    AvgResponseEnd: {
      sql: `responseEnd`,
      type: `avg`
    },

    AvgDomContentLoaded: {
      sql: `domContentLoaded`,
      type: `avg`
    },

    AvgDomInteractiveTime: {
      sql: `domInteractiveTime`,
      type: `avg`
    }
  },
  
  dimensions: {
        
    id: {
      sql: `actor`,
      type: `string`,
      primaryKey: true
    },
  /*   url: {
      sql: `url`,
      type: `string`
    },

    eventId: {
      sql: `event_id`,
      type: `number`,

    }, */
    schoolId: {
      sql: `${Actor}.school_id`,
      type: `string`
    },

    role: {
      sql: `actor.roles`,
      type: `string`
    },

    timeStamp: {
      sql: `time`,
      type: `time`
    },

    dayOfWeek: {
      sql: `to_char(time, 'Day')`,
      type: `string`
    },

    page: {
      sql: `SUBSTRING(
              SUBSTRING(
                object,
                POSITION('//' IN object)+2
              ),
              POSITION('/' IN SUBSTRING(object,POSITION('//' IN object)+2))
            )`,
      type: `string`
    }
  },

  segments: {
    kurse: {
     sql: `object LIKE '%/courses/%'`
    },
    datein: {
      sql: `object LIKE '%/files/%'`
    },
    administration: {
      sql: `object LIKE '%/administration/%'`
    }
 }
});
