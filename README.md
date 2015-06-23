uql-bench
==========

A tool that measures performance of SQL query builders for node.js. It has been written to tune uql.js library, but more modules were included for comparison purposes.

  * [Official Repository (exceptionaljs/uql-bench)](https://github.com/exceptionaljs/uql-bench)
  * [Public Domain (unlicense.org)](http://unlicense.org)

Libraries
=========

At the moment these libraries are tested:

  * knex
  * squel
  * uql

Where `uql` and `knex` produce well formed output (strings are formatted and escaped), but `squel` doesn't seem to be escaping identifiers and values. The purpose of this tool is benchmark, not to check for a proper escaping, so libraries that don't escape have an advantage.

Results
=======

These results were obtained on a development machine by running `node uql-bench.js` or `npm run bench`. The actual times are not important as these will vary depending on your CPU and node version, however, the comparison of times with other tests matters. The run is currently configured to build 100000 queries per test, but it can be modified by changing `Options.quantity`.

```
uql.js 1.0.0
SELECT_0: 0.158 [s]: SELECT "a", "b", "c" FROM "x";
SELECT_1: 0.265 [s]: SELECT "a", "b", "c" FROM "x" WHERE "enabled" = TRUE OFFSET 100 LIMIT 50;
SELECT_2: 0.421 [s]: SELECT "a", "b", "c" FROM "x" WHERE ("enabled" = FALSE AND "pending" = FALSE) AND "blocked" = FALSE;
SELECT_3: 0.433 [s]: SELECT "x"."a", "x"."b", "y"."c" FROM "x" INNER JOIN "y" ON "x"."uid" = "y"."uid";
INSERT_0: 0.500 [s]: INSERT INTO "x" ("a", "b", "c") VALUES (0, FALSE, E'\'someText"');
UPDATE_0: 0.685 [s]: UPDATE "x" SET "a" = 1, "b" = 2, "c" = E'\'"?someStringToBeEscaped\'' WHERE "uid" = 1;
DELETE_0: 0.167 [s]: DELETE FROM "x" WHERE "uid" >= 1;

Knex 0.8.6
SELECT_0: 1.668 [s]: select "a", "b", "c" from "x"
SELECT_1: 2.661 [s]: select "a", "b", "c" from "x" where "enabled" = true limit 50 offset 100
SELECT_2: 4.543 [s]: select "a", "b", "c" from "x" where "enabled" = false and "pending" = false and "blocked" = false
SELECT_3: 5.332 [s]: select "x"."a", "x"."b", "y"."c" from "x" inner join "y" on "x"."uid" = "y"."uid"
INSERT_0: 3.554 [s]: insert into "x" ("a", "b", "c") values (0, false, '\'someText\"')
UPDATE_0: 4.419 [s]: update "x" set "a" = 1, "b" = 2, "c" = '\'\"?someStringToBeEscaped\'' where "uid" = 1
DELETE_0: 2.420 [s]: delete from "x" where "uid" >= 10

Squel 4.0.0
SELECT_0:62.959 [s]: SELECT a, b, c FROM x
SELECT_1:58.593 [s]: SELECT a, b, c FROM x WHERE (enabled = TRUE) LIMIT 50 OFFSET 100
SELECT_2:55.380 [s]: SELECT a, b, c FROM x WHERE (enabled = FALSE) AND (pending = FALSE) AND (blocked = FALSE)
SELECT_3:60.571 [s]: SELECT x.uid, x.name, r.granted FROM x LEFT JOIN y `x.uid = y.uid`
INSERT_0:25.379 [s]: INSERT INTO x (a, b, c) VALUES (0, FALSE, ''someText"')
UPDATE_0:35.049 [s]: UPDATE x SET a = 1, b = 2, c = ''"?someStringToBeEscaped'' WHERE (uid = 1)
DELETE_0:34.685 [s]: DELETE FROM x WHERE (uid >= 1)
```

Conclusion
----------

The winner is uql.js! It's more than 3 times faster than Knex and 10 to 100 times faster than Squel (maybe some coffee script issue, hard to tell why the difference is so huge, seems unrealistic). So the conclusion would be that full-featured doesn't necessarily have to be slow, and lightweight doesn't necessarily have to be fast. uql.js has been designed keeping performance in mind, it doesn't create unnecessary objects if they are not needed, and it allows to mix JS types with expression nodes to avoid creating nodes that just wrap identifiers or values. It contains also very optimized escaping and query substitution implementation, but it seems that the design of the library plays more important role in terms of performance than few ultra-optimized functions.

It's also hard to tell if the difference between uql.js and Knex would impact the performance of the running application where a query execution requires much more than building a string. However, minimizing the object instantiation is a good practice in any runtime environment; and since node.js is a single-threaded environment improving execution of _blocking_ code is probably always a good idea.
