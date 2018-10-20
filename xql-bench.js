"use strict";

const knex = require("knex")({
  // We have to use some DB, this seems easiest.
  client: "sqlite3",
  connection: {
    filename: ":memory:"
  }
});

const sqlbricks = require("sql-bricks");
const squel = require("squel");
const xql = require("xql");

// ============================================================================
// [Options]
// ============================================================================

const Options = {
  quantity: 100000 // Number of calls.
};

const IgnoredKeys = {
  moduleInfo: true
};

// ============================================================================
// [Knex]
// ============================================================================

const KnexBench = (function() {
  return {
    moduleInfo: function() {
      return "Knex " + require("knex/package").version;
    },

    SELECT_0: function() {
      return knex("x")
       .select(["a", "b", "c"])
       .toString();
    },

    SELECT_1: function() {
      return knex("x")
       .select(["a", "b", "c"])
       .where("enabled", "=", true)
       .offset(100)
       .limit(50)
       .toString();
    },

    SELECT_2: function() {
      return knex("x")
       .select(["a", "b", "c"])
       .where("enabled", "=", false)
       .where("pending", "=", false)
       .where("blocked", "=", false)
       .toString();
    },

    SELECT_3: function() {
      return knex("x")
       .select(["x.a", "x.b", "y.c"])
       .innerJoin("y", "x.uid", "y.uid")
       .toString();
    },

    INSERT_0: function() {
      return knex("x")
        .insert({ a: 0, b: false, c: "'someText\"" })
        .toString();
    },

    UPDATE_0: function() {
      return knex("x")
        .update({
          a: 1,
          b: 2,
          c: "'\"?someStringToBeEscaped'"
        })
        .where("uid", "=", 1)
        .toString();
    },

    DELETE_0: function() {
      return knex("x")
        .del()
        .where("uid", ">=", 1)
        .toString();
    }
  };
})();

// ============================================================================
// [SqlBricksBench]
// ============================================================================

const SqlBricksBench = (function() {
  return {
    moduleInfo: function() {
      return "SqlBricks " + require("sql-bricks/package").version;
    },

    SELECT_0: function() {
      return sqlbricks.select("a", "b", "c")
        .from("x")
        .toString();
    },

    SELECT_1: function() {
      // Unfair, SqlBricks doesn't provide LIMIT/OFFSET without extensions.
      return sqlbricks.select("a", "b", "c")
        .from("x")
        .where({ enabled: true })
        .toString();
    },

    SELECT_2: function() {
      return sqlbricks.select("a", "b", "c")
        .from("x")
        .where("enabled", false)
        .where("pending", false)
        .where("blocked", false)
        .toString();
    },

    SELECT_3: function() {
      return sqlbricks.select("x.a", "x.b", "x.c")
        .from("x")
        .leftJoin("y", { "x.uid": "y.uid" })
        .toString();
    },

    INSERT_0: function() {
      return sqlbricks.insert("x", { a: 0, b: false, c: "'someText\"" })
        .toString();
    },

    UPDATE_0: function() {
      return sqlbricks.update("x", { a: 1, b: 2, c: "'\"?someStringToBeEscaped'" })
        .where("uid", 1).toString();
    },

    DELETE_0: function() {
      return sqlbricks.delete("x")
        .where("uid", 1).toString();
    }
  };
})();

// ============================================================================
// [Squel]
// ============================================================================

const SquelBench = (function() {
  return {
    moduleInfo: function() {
      return "Squel " + require("squel/package").version;
    },

    SELECT_0: function() {
      return squel.select()
        .from("x")
        .field("a").field("b").field("c")
        .toString();
    },

    SELECT_1: function() {
      return squel.select()
        .from("x")
        .field("a").field("b").field("c")
        .where("enabled = TRUE")
        .offset(100)
        .limit(50)
        .toString();
    },

    SELECT_2: function() {
      return squel.select()
        .from("x")
        .field("a").field("b").field("c")
        .where("enabled = FALSE")
        .where("pending = FALSE")
        .where("blocked = FALSE")
        .toString();
    },

    SELECT_3: function() {
      return squel.select()
        .from("x")
        .field("x.a").field("x.b").field("x.c")
        .left_join("y", "x.uid = y.uid")
        .toString();
    },

    INSERT_0: function() {
      return squel.insert()
        .into("x")
        .setFields({ a: 0, b: false, c: "'someText\"" })
        .toString();
    },

    UPDATE_0: function() {
      return squel.update()
        .table("x")
        .set("a", 1)
        .set("b", 2)
        .set("c", "'\"?someStringToBeEscaped'")
        .where("uid = 1")
        .toString();
    },

    DELETE_0: function() {
      return squel.delete()
        .from("x")
        .where("uid >= 1")
        .toString();
    }
  };
})();

// ============================================================================
// [xql.js]
// ============================================================================

const XqlBench = (function() {
  const xqlpg = xql.dialect.newContext({ dialect: "pgsql" });

  const SELECT = xql.SELECT;
  const UPDATE = xql.UPDATE;
  const INSERT = xql.INSERT;
  const DELETE = xql.DELETE;

  const COL = xql.COL;
  const OP = xql.OP;

  return {
    moduleInfo: function() {
      return "xql.js " + xql.misc.VERSION;
    },

    SELECT_0: function() {
      return SELECT(["a", "b", "c"])
        .FROM("x")
        .compileQuery(xqlpg);
    },

    SELECT_1: function() {
      return SELECT(["a", "b", "c"])
        .FROM("x")
        .WHERE("enabled", "=", true)
        .OFFSET(100)
        .LIMIT(50)
        .compileQuery(xqlpg);
    },

    SELECT_2: function() {
      return SELECT(["a", "b", "c"])
        .FROM("x")
        .WHERE("enabled", "=", false)
        .WHERE("pending", "=", false)
        .WHERE("blocked", "=", false)
        .compileQuery(xqlpg);
    },

    SELECT_3: function() {
      return SELECT(["x.a", "x.b", "y.c"])
        .FROM("x")
        .INNER_JOIN("y", OP(COL("x.uid"), "=", COL("y.uid")))
        .compileQuery(xqlpg);
    },

    INSERT_0: function() {
      return INSERT("x")
        .VALUES({ a: 0, b: false, c: "'someText\"" })
        .compileQuery(xqlpg);
    },

    UPDATE_0: function() {
      return UPDATE("x")
        .VALUES({
          a: 1,
          b: 2,
          c: "'\"?someStringToBeEscaped'"
        })
        .WHERE("uid", "=", 1)
        .compileQuery(xqlpg);
    },

    DELETE_0: function() {
      return DELETE("x")
        .WHERE("uid", ">=", 1)
        .compileQuery(xqlpg);
    }
  };
})();

// ============================================================================
// [Utils]
// ============================================================================

const Utils = {
  padLeft: function(s, n) {
    while (s.length < n)
      s = " " + s;
    return s;
  },

  test: function(fn, name) {
    var result = "";
    var query = fn();

    var quantity = Options.quantity;
    var timeStart = +new Date();

    for (var i = 0; i < quantity; i++) {
      result = result.substring(0, 0) + fn();
    }

    var timeEnd = +new Date();
    var timeStr = Utils.padLeft(((timeEnd - timeStart) / 1000).toFixed(3), 6);

    console.log(name + ":" + timeStr + " [s]: " + query);
  }
};

// ============================================================================
// [Main]
// ============================================================================

function main() {
  var modules = [
    KnexBench,
    SqlBricksBench,
    SquelBench,
    XqlBench
  ];

  modules.forEach(function(module) {
    console.log(module.moduleInfo());
    for (var name in module) {
      if (IgnoredKeys[name] === true)
        continue;
      Utils.test(module[name], name);
    }
    console.log("");
  });
}

main();
