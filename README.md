QSql-Bench
==========

A tool that measures performance of SQL query builders for node.js. It has been written to tune QSql library, but more modules were included for comparison purposes.

  * [Official Repository (jshq/qsql-bench)](https://github.com/jshq/qsql-bench)
  * [Unlicense] (http://unlicense.org)

Libraries
=========

At the moment these libraries are benchmarked:

  * qsql
  * knex
  * squel

Where `qsql` and `knex` produce well formed output (strings are formatted and escaped), but `squel` doesn't seem to be escaping identifiers and values. The purpose of this tool is not to check for a proper escaping, but these libraries that don't escape need less operations to construct the query so it should be taken into consideration.

Results
=======

These results were obtained on a development machine by running `node qsql-bench.js` or `npm run bench`. The actual times are not important as these will vary depending on your CPU and node version, however, the comparison of times with other tests matters. The run is currently configured to build 100000 queries per test, but it can be modified by changing `Options.quantity`.

```
QSql 0.2.0
SELECT_0: 0.127 [s]: SELECT "a", "b", "c" FROM "x";
SELECT_1: 0.228 [s]: SELECT "a", "b", "c" FROM "x" WHERE "enabled" = TRUE OFFSET 100 LIMIT 50;
SELECT_2: 0.386 [s]: SELECT "a", "b", "c" FROM "x" WHERE ("enabled" = FALSE AND "pending" = FALSE) AND "blocked" = FALSE;
SELECT_3: 0.400 [s]: SELECT "x"."a", "x"."b", "y"."c" FROM "x" INNER JOIN "y" ON "x"."uid" = "y"."uid";
INSERT_0: 0.497 [s]: INSERT INTO "x" ("a", "b", "c") VALUES (0, FALSE, E'\'someText"');
UPDATE_0: 0.683 [s]: UPDATE "x" SET "a" = 1, "b" = 2, "c" = E'\'"?someStringToBeEscaped\'' WHERE "uid" = 1;
DELETE_0: 0.152 [s]: DELETE FROM "x" WHERE "uid" >= 1;

Knex 0.7.3
SELECT_0: 0.904 [s]: select "a", "b", "c" from "x"
SELECT_1: 1.873 [s]: select "a", "b", "c" from "x" where "enabled" = true limit 50 offset 100
SELECT_2: 1.905 [s]: select "a", "b", "c" from "x" where "enabled" = false and "pending" = false and "blocked" = false
SELECT_3: 1.760 [s]: select "x"."a", "x"."b", "y"."c" from "x" inner join "y" on "x"."uid" = "y"."uid"
INSERT_0: 1.739 [s]: insert into "x" ("a", "b", "c") values (0, false, '\'someText\"')
UPDATE_0: 1.839 [s]: update "x" set "a" = 1, "b" = 2, "c" = '\'\"?someStringToBeEscaped\'' where "uid" = 1
DELETE_0: 0.878 [s]: delete from "x" where "uid" >= 10

Squel 3.9.1
SELECT_0:36.879 [s]: SELECT a, b, c FROM x
SELECT_1:37.423 [s]: SELECT a, b, c FROM x WHERE (enabled = TRUE) LIMIT 50 OFFSET 100
SELECT_2:37.640 [s]: SELECT a, b, c FROM x WHERE (enabled = FALSE) AND (pending = FALSE) AND (blocked = FALSE)
SELECT_3:37.294 [s]: SELECT x.uid, x.name, r.granted FROM x LEFT JOIN y `x.uid = y.uid`
INSERT_0:13.041 [s]: INSERT INTO x (a, b, c) VALUES (0, FALSE, ''someText"')
UPDATE_0:22.156 [s]: UPDATE x SET a = 1, b = 2, c = ''"?someStringToBeEscaped'' WHERE (uid = 1)
DELETE_0:21.910 [s]: DELETE FROM x WHERE (uid >= 1)
```

Conclusion
----------

QSql is clearly the winner. It's more than 3 times faster than Knex and 10-100 times faster than Squel (maybe some coffee script issue, hard to tell why the difference is so huge). So the conclusion would be that full-featured doesn't necessarily have to be slow, and lightweight doesn't necessarily have to be fast. QSql has been designed in performance in mind, it doesn't create unnecessary objects if they are not needed, and it allows to mix JS types with expression nodes to avoid nodes that just wrap identifiers or values. It contains also very optimized escaping and query substitution engine, but it seems that the design of the library plays more important role in terms of performance than few ultra-optimized functions.

It's also hard to tell if the difference between QSql and Knex would impact the performance of the running application where a query execution requires much more than building a string. However, minimizing object construction is probably a good idea and may be beneficial; and since node.js is a single-threaded environment improving execution of _blocking_ code is probably always a good idea.
