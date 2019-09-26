cube(`Events`, {
  sql: `SELECT * FROM events.events`,
  
  joins: {
    Sessions: {
      relationship: `belongsTo`,
      sql: `
        ${Events}.uid = ${Sessions}.uid
        AND ${Events}.timestamp >= ${Sessions}.session_start_at
        AND (${Events}.timestamp < ${Sessions}.next_session_start_at or ${Sessions}.next_session_start_at is null)
      `
    }
  },
  
  measures: {

    // count: {
    //   type: `count`,
    //   drillMembers: [timestamp]
    // },

    monthlyActiveUsers: {
      sql: `uid`,
      type: `countDistinct`,
      rollingWindow: {
        trailing: `30 day`,
        offset: `start`
      }
    },

    weeklyActiveUsers: {
      sql: `uid`,
      type: `countDistinct`,
      rollingWindow: {
        trailing: `1 week`,
        offset: `start`
      }
    },

    dailyActiveUsers: {
      sql: `uid`,
      type: `countDistinct`,
      rollingWindow: {
        trailing: `1 day`,
        offset: `start`
      }
    },

    dauToMau: {
      title: `DAU to MAU`,
      sql: `100.000 * ${dailyActiveUsers} / NULLIF(${monthlyActiveUsers}, 0)`,
      type: `number`,
      format: `percent`
    },

    lastEventTimestamp: {
      sql: `timestamp`,
      type: `max`,
      shown: false
    }
  },
  
  dimensions: {
    url: {
      sql: `url`,
      type: `string`
    },
    
    uid: {
      sql: `uid`,
      type: `string`
    },

    eventId: {
      sql: `event_id`,
      type: `number`,
      primaryKey: true
    },
    
    timestamp: {
      sql: `timestamp`,
      type: `time`
    }
  }
});
