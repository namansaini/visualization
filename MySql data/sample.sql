SELECT * FROM messages;
SELECT * FROM message_comments;

select user_type, group_concat(le) uuid, count(1) from
(SELECT t1.uuid le, t2.uuid re, (CASE WHEN t2.uuid is not null THEN 'returning user' ELSE 'new user' END) user_type FROM 
(SELECT DISTINCT uuid FROM fliplearn_gamification.assessment_user_performance WHERE uuid is not null AND uuid <> '' AND created_on BETWEEN '2019-06-27 00:00:00' AND '2019-07-03 23:59:59') t1
LEFT JOIN 
(SELECT DISTINCT uuid FROM fliplearn_gamification.assessment_user_performance WHERE uuid IS NOT NULL AND uuid <> '' AND created_on < '2019-06-27 00:00:00') t2
ON t1.uuid = t2.uuid) x group by x.user_type;

SELECT x.uuid, um.login_id, um.first_name FROM 
(SELECT t1.uuid, t2.uuid re, (CASE WHEN t2.uuid is not null THEN 'returning user' ELSE 'new user' END) user_type FROM 
(SELECT DISTINCT uuid FROM fliplearn_gamification.assessment_user_performance WHERE uuid is not null AND uuid <> '' AND created_on BETWEEN '2019-06-27 00:00:00' AND '2019-07-03 23:59:59') t1
LEFT JOIN 
(SELECT DISTINCT uuid FROM fliplearn_gamification.assessment_user_performance WHERE uuid IS NOT NULL AND uuid <> '' AND created_on < '2019-06-27 00:00:00') t2
ON t1.uuid = t2.uuid) x
LEFT JOIN 
user_master um
ON x.uuid=um.uuid;