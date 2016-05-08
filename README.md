xql-bench
==========

A tool that measures performance of SQL query builders for node.js. It has been written to tune xql.js library, but more modules were included for comparison purposes.

  * [Official Repository (exceptionaljs/xql-bench)](https://github.com/exceptionaljs/xql-bench)
  * [Public Domain (unlicense.org)](http://unlicense.org)

Libraries
=========

At the moment these libraries are tested:

  * knex
  * squel
  * xql

Where `xql` and `knex` produce well formed output (strings are formatted and escaped), but `squel` doesn't seem to be escaping identifiers and values. The purpose of this tool is benchmark, not to check for a proper escaping, so libraries that don't escape have an advantage.

Results
=======

These results were obtained on a development machine by running `node xql-bench.js` or `npm run bench`. The actual times are not important as these will vary depending on your CPU and node version, however, the comparison of times with other tests matters. The run is currently configured to build 100000 queries per test, but it can be modified by changing `Options.quantity`.

```
xql.js 1.0.0
SELECT_0: 0.153 [s]: SELECT "a", "b", "c" FROM "x";
SELECT_1: 0.262 [s]: SELECT "a", "b", "c" FROM "x" WHERE "enabled" = TRUE OFFSET 100 LIMIT 50;
SELECT_2: 0.412 [s]: SELECT "a", "b", "c" FROM "x" WHERE "enabled" = FALSE AND "pending" = FALSE AND "blocked" = FALSE;
SELECT_3: 0.378 [s]: SELECT "x"."a", "x"."b", "y"."c" FROM "x" INNER JOIN "y" ON "x"."uid" = "y"."uid";
INSERT_0: 0.178 [s]: INSERT INTO "x" ("a", "b", "c") VALUES (0, FALSE, E'\'someText"');
UPDATE_0: 0.270 [s]: UPDATE "x" SET "a" = 1, "b" = 2, "c" = E'\'"?someStringToBeEscaped\'' WHERE "uid" = 1;
DELETE_0: 0.118 [s]: DELETE FROM "x" WHERE "uid" >= 1;

Knex 0.11.1
SELECT_0: 0.464 [s]: select "a", "b", "c" from "x"
SELECT_1: 1.898 [s]: select "a", "b", "c" from "x" where "enabled" = true limit 50 offset 100
SELECT_2: 2.007 [s]: select "a", "b", "c" from "x" where "enabled" = false and "pending" = false and "blocked" = false
SELECT_3: 1.460 [s]: select "x"."a", "x"."b", "y"."c" from "x" inner join "y" on "x"."uid" = "y"."uid"
INSERT_0: 2.020 [s]: insert into "x" ("a", "b", "c") values (0, false, '''someText"')
UPDATE_0: 2.633 [s]: update "x" set "a" = 1, "b" = 2, "c" = '''"?someStringToBeEscaped''' where "uid" = 1
DELETE_0: 0.945 [s]: delete from "x" where "uid" >= 1

Squel 5.0.4
SELECT_0:27.740 [s]: SELECT a, b, c FROM x
SELECT_1:28.423 [s]: SELECT a, b, c FROM x WHERE (enabled = TRUE) LIMIT 50 OFFSET 100
SELECT_2:28.766 [s]: SELECT a, b, c FROM x WHERE (enabled = FALSE) AND (pending = FALSE) AND (blocked = FALSE)
SELECT_3:28.012 [s]: SELECT x.uid, x.name, r.granted FROM x LEFT JOIN y `x.uid = y.uid`
INSERT_0:10.326 [s]: INSERT INTO x (a, b, c) VALUES (0, FALSE, ''someText"')
UPDATE_0:14.354 [s]: UPDATE x SET a = 1, b = 2, c = ''"?someStringToBeEscaped'' WHERE (uid = 1)
DELETE_0:14.767 [s]: DELETE FROM x WHERE (uid >= 1)
```

Conclusion
----------

The winner is xql.js! It's more than 3 times faster than Knex and 10 to 100 times faster than Squel (maybe some coffee script issue, hard to tell why the difference is so huge, seems unrealistic). So the conclusion would be that full-featured doesn't necessarily have to be slow, and lightweight doesn't necessarily have to be fast. xql.js has been designed keeping performance in mind, it doesn't create unnecessary objects if they are not needed, and it allows to mix JS types with expression nodes to avoid creating nodes that just wrap identifiers or values. It contains also very optimized escaping and query substitution implementation, but it seems that the design of the library plays more important role in terms of performance than few ultra-optimized functions.

It's also hard to tell if the difference between xql.js and Knex would impact the performance of the running application where a query execution requires much more than building a string. However, minimizing the object instantiation is a good practice in any runtime environment; and since node.js is a single-threaded environment improving execution of _blocking_ code is probably always a good idea.
