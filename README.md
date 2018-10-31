xql-bench
==========

A tool that measures performance of SQL query builders for node.js. It has been written to tune xql.js library, but more modules were included for comparison purposes.

  * [Official Repository (jsstuff/xql-bench)](https://github.com/jsstuff/xql-bench)
  * [Public Domain (unlicense.org)](http://unlicense.org)

Libraries
=========

At the moment these libraries are tested:

  * knex
  * sql-bricks
  * squel
  * xql
  * Don't see your favorite library? Make a pull request!


Where `xql` and `knex` produce well formed output (strings are formatted and escaped), but `squel` doesn't seem to be escaping identifiers and values. The purpose of this tool is to benchmark and not to check for a proper escaping, however, libraries that don't escape by default are dangerous and have an advantage as escaping also costs some cycles.

Results
=======

These results were obtained on a development machine by running `node xql-bench.js`. The actual times are not important as these will vary depending on your CPU and node version, however, the comparison of times with other tests matters. The run is currently configured to build 100000 queries per test, but it can be modified by changing `Options.quantity`.

```
Knex 0.15.2
SELECT_0: 1.227 [s]: select `a`, `b`, `c` from `x`
SELECT_1: 1.514 [s]: select `a`, `b`, `c` from `x` where `enabled` = true limit 50 offset 100
SELECT_2: 1.549 [s]: select `a`, `b`, `c` from `x` where `enabled` = false and `pending` = false and `blocked` = false
SELECT_3: 1.701 [s]: select `x`.`a`, `x`.`b`, `y`.`c` from `x` inner join `y` on `x`.`uid` = `y`.`uid`
INSERT_0: 1.343 [s]: insert into `x` (`a`, `b`, `c`) values (0, false, '''someText"')
UPDATE_0: 1.730 [s]: update `x` set `a` = 1, `b` = 2, `c` = '''"?someStringToBeEscaped''' where `uid` = 1
DELETE_0: 1.100 [s]: delete from `x` where `uid` >= 1

SqlBricks 2.0.3
SELECT_0: 1.736 [s]: SELECT a, b, c FROM x
SELECT_1: 2.114 [s]: SELECT a, b, c FROM x WHERE enabled = TRUE
SELECT_2: 2.408 [s]: SELECT a, b, c FROM x WHERE enabled = FALSE AND pending = FALSE AND blocked = FALSE
SELECT_3: 2.079 [s]: SELECT x.a, x.b, x.c FROM x LEFT JOIN y ON x.uid = y.uid
INSERT_0: 1.020 [s]: INSERT INTO x (a, b, c) VALUES (0, FALSE, '''someText"')
UPDATE_0: 1.180 [s]: UPDATE x SET a = 1, b = 2, c = '''"?someStringToBeEscaped''' WHERE uid = 1
DELETE_0: 0.567 [s]: DELETE FROM x WHERE uid = 1

Squel 5.12.2
SELECT_0:20.905 [s]: SELECT a, b, c FROM x
SELECT_1:21.648 [s]: SELECT a, b, c FROM x WHERE (enabled = TRUE) LIMIT 50 OFFSET 100
SELECT_2:19.820 [s]: SELECT a, b, c FROM x WHERE (enabled = FALSE) AND (pending = FALSE) AND (blocked = FALSE)
SELECT_3:19.500 [s]: SELECT x.a, x.b, x.c FROM x LEFT JOIN y `x.uid = y.uid`
INSERT_0: 7.240 [s]: INSERT INTO x (a, b, c) VALUES (0, FALSE, ''someText"')
UPDATE_0:10.494 [s]: UPDATE x SET a = 1, b = 2, c = ''"?someStringToBeEscaped'' WHERE (uid = 1)
DELETE_0:11.295 [s]: DELETE FROM x WHERE (uid >= 1)

xql.js 1.4.3
SELECT_0: 0.090 [s]: SELECT "a", "b", "c" FROM "x";
SELECT_1: 0.193 [s]: SELECT "a", "b", "c" FROM "x" WHERE "enabled" = TRUE LIMIT 50 OFFSET 100;
SELECT_2: 0.257 [s]: SELECT "a", "b", "c" FROM "x" WHERE "enabled" = FALSE AND "pending" = FALSE AND "blocked" = FALSE;
SELECT_3: 0.275 [s]: SELECT "x"."a", "x"."b", "y"."c" FROM "x" INNER JOIN "y" ON "x"."uid" = "y"."uid";
INSERT_0: 0.183 [s]: INSERT INTO "x" ("a", "b", "c") VALUES (0, FALSE, E'\'someText"');
UPDATE_0: 0.255 [s]: UPDATE "x" SET "a" = 1, "b" = 2, "c" = E'\'"?someStringToBeEscaped\'' WHERE "uid" = 1;
DELETE_0: 0.110 [s]: DELETE FROM "x" WHERE "uid" >= 1;
```

Conclusion
----------

The winner is clearly xql.js as it's many times faster than all other competing libraries. It seems that the xql.js is simply well-written from the performance standpoint. It also provides a lot of features and SQL constructs that other libraries don't offer or only offer through raw-query functionality (adding raw content to the query). The benchmarks were written in a way to not favor any library - they are simple by nature, but it's possible to add more complex queries in the future (and more engines).

