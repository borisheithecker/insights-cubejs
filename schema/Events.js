cube(`Events`, {
  sql: `SELECT * FROM activity`,
  
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
        trailing: `30 day`,
        offset: `start`
      }
    },

    weeklyActiveUsers: {
      sql: `actor`,
      type: `countDistinct`,
      rollingWindow: {
        trailing: `1 week`,
        offset: `start`
      }
    },

    dailyActiveUsers: {
      sql: `actor`,
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
      sql: `time`,
      type: `max`,
      shown: false
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
      sql: `actor.school_id`,
      type: `string`
    },

    role: {
      sql: `actor.roles`,
      type: `string`
    },

    timeStamp: {
      sql: `time`,
      type: `time`
    }
  }
});
