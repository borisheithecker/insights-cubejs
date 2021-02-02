cube(`RawEvents`, {
  sql: `
        SELECT
          *
        FROM 
          activity
       `,
  
  joins: {
    Actor: {
      relationship: `belongsTo`,
      sql: `
        ${RawEvents}.actor = ${Actor}.insights_id
      `
    }
  },
  
  measures: {

    count: {
      sql: `id`,
      type: `countDistinct`
    //   drillMembers: [timestamp]
    },

    schools: {
      sql: `${Actor}.school_id`,
      type: `countDistinct`,
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

    dayOfMonth: {
      sql: `to_char(time, 'DD')`,
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
     sql: `object LIKE '%/courses/ID%'`
    },
    datein: {
      sql: `object LIKE '%/files/%'`
    },
    administration: {
      sql: `object LIKE '%/administration/%'`
    },
    assignment: {
      sql: `object LIKE '%/homework/ID%'`
    },
    calendar: {
      sql: `object LIKE '%/calendar%'`
    }
 }
});
