SET FOREIGN_KEY_CHECKS = 0;
ALTER TABLE `stamp_test`.`user_answer` 
DROP FOREIGN KEY `FK_user_answer_status`;
ALTER TABLE `stamp_test`.`user_answer` 
DROP INDEX `FK_user_answer_status` ,
ADD INDEX `FK_user_answer_status_idx` (`id_status` ASC);
ALTER TABLE `stamp_test`.`user_answer` 
ADD CONSTRAINT `FK_user_answer_status`
  FOREIGN KEY (`id_status`)
  REFERENCES `stamp_test`.`request_status` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;


SELECT * from stamp_test.`service_status`;
UPDATE stamp_test.user_answer SET id_status = id_status + 10 WHERE id >= 1;
UPDATE stamp_test.evaluation_request SET id_request_status = id_request_status + 10 WHERE id_request_status >= 1;
UPDATE stamp_test.service_status SET id_status = id_status + 10 WHERE id_service >= 1;
UPDATE stamp_test.service SET current_status = current_status + 10 WHERE id >= 1;


TRUNCATE TABLE stamp_test.status;
TRUNCATE TABLE stamp_test.request_status;

INSERT INTO stamp_test.status VALUES 
(1,'INCOMPLETO','30','2','1','EN DILIGENCIAMIENTO POR LA ENTIDAD'),
(2,'VERIFICACION','10','5','1','EN VERIFICACIÓN POR EL ADMON'),
(3,'EVALUACION','30','2','1','EN PROCESO DE EVALUACIÓN'),
(4,'CUMPLE','365','2','1','CUMPLE'),
(5,'NO_CUMPLE','365','2','1','NO CUMPLE');

UPDATE stamp_test.service_status SET id_status = 1 WHERE id_status = 20;
UPDATE stamp_test.service_status SET id_status = 2 WHERE id_status = 11;
UPDATE stamp_test.service_status SET id_status = 3 WHERE id_status = 15;
UPDATE stamp_test.service_status SET id_status = 4 WHERE id_status = 18;
UPDATE stamp_test.service_status SET id_status = 5 WHERE id_status = 19;

UPDATE stamp_test.service SET current_status = 1 WHERE current_status = 20;
UPDATE stamp_test.service SET current_status = 2 WHERE current_status = 11;
UPDATE stamp_test.service SET current_status = 3 WHERE current_status = 15;
UPDATE stamp_test.service SET current_status = 4 WHERE current_status = 18;
UPDATE stamp_test.service SET current_status = 5 WHERE current_status = 19;

INSERT INTO stamp_test.request_status VALUES 
(1,'PENDIENTE','30','2','1','ESPERANDO APROBACION'),
(2,'ERROR','10','5','1','TIENE UN ERROR'),
(3,'POR_ASIGNAR','10','5','1','APROBADO POR EL ADMINISTRADOR'),
(4,'SOLICITADO','10','5','1','SOLICITADO VOLUNTARIAMENTE'),
(5,'ASIGNADO','30','2','1','ESPERANDO RESPUESTA DEL EVALUADOR'),
(6,'ACEPTADO','30','2','1','ACEPTADO POR EL EVALUADOR'),
(7,'RECHAZADO','30','2','1','RECHAZADO POR EL EVALUADOR'),
(8,'RETROALIMENTACION','30','2','1','EN RETROALIMENTACION'),
(9,'CUMPLE','365','2','1','CUMPLE'),
(10,'NO_CUMPLE','365','2','1','NO CUMPLE');

UPDATE stamp_test.user_answer SET id_status = 1 WHERE id_status = 11;
UPDATE stamp_test.user_answer SET id_status = 2 WHERE id_status = 20;
UPDATE stamp_test.user_answer SET id_status = 3 WHERE id_status = 12;
UPDATE stamp_test.user_answer SET id_status = 8 WHERE id_status = 16;
UPDATE stamp_test.user_answer SET id_status = 9 WHERE id_status = 18;
UPDATE stamp_test.user_answer SET id_status = 10 WHERE id_status = 19;

UPDATE stamp_test.evaluation_request SET id_request_status = 4 WHERE id_request_status = 12;
UPDATE stamp_test.evaluation_request SET id_request_status = 5 WHERE id_request_status = 13;
UPDATE stamp_test.evaluation_request SET id_request_status = 6 WHERE id_request_status = 14;
UPDATE stamp_test.evaluation_request SET id_request_status = 7 WHERE id_request_status = 15;
UPDATE stamp_test.evaluation_request SET id_request_status = 8 WHERE id_request_status = 16;
UPDATE stamp_test.evaluation_request SET id_request_status = 9 WHERE id_request_status = 17;
UPDATE stamp_test.evaluation_request SET id_request_status = 10 WHERE id_request_status = 18;


SET FOREIGN_KEY_CHECKS = 1;
