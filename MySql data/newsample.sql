SELECT x.uuid, um.login_id, um.first_name FROM 
(SELECT t1.uuid, t2.uuid re, (CASE WHEN t2.uuid is not null THEN 'returning user' ELSE 'new user' END) user_type FROM 
(SELECT DISTINCT uuid FROM doubtdatabase.assessment_user_performance WHERE uuid is not null AND uuid <> '' AND created_on BETWEEN '2019-04-24 00:00:00' AND '2019-04-25 23:59:59') t1
LEFT JOIN 
(SELECT DISTINCT uuid FROM doubtdatabase.assessment_user_performance WHERE uuid IS NOT NULL AND uuid <> '' AND created_on < '2019-04-24 00:00:00') t2
ON t1.uuid = t2.uuid) x 
LEFT JOIN 
user_master um 
ON x.uuid=um.uuid;

SELECT * FROM assessment_user_performance;
SELECT * FROM user_master;
TRUNCATE TABLE user_master;

SELECT um.uuid, um.login_id, um.first_name FROM user_master um WHERE uuid IN (" + uuidStr + ");
