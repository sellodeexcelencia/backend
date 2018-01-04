/**
 * relations
 * 1-1
 * {
        type: "1-1",
        name: "category",
        foreign_name: "name",
        entity: "category",
        leftKey: "id_category"
      }
 * 1-n rightKey 
 * {
        type:"1-n",
        name:"history",
        rightKey:"id_service",
        entity:"service_status"
  }
 * n-n intermediate table
 * {
      type: "n-n",
      entity: "role",
      name: "roles",
      intermediate: {
        entity: "user_role",
        leftKey: "id_user",
        rightKey: "id_role"
      }
    }
 */
if (!dmt) {
  var dmt = {}
}
dmt.entities = {
  "user": {
    table: "user",
    relations: [
      {
        type: "n-n",
        entity: "role",
        name: "roles",
        intermediate: {
          entity: "user_role",
          leftKey: "id_user",
          rightKey: "id_role"
        }
      },
      {
        type: "n-n",
        entity: "category",
        name: "categories",
        intermediate: {
          entity: "user_category",
          leftKey: "id_user",
          rightKey: "id_category"
        }
      },
      {
        type: "n-n",
        entity: "questiontopic",
        name: "topics",
        intermediate: {
          entity: "user_questiontopic",
          leftKey: "id_user",
          rightKey: "id_topic",
        }
      },
      {
        type: "1-1",
        name: "availability",
        entity: "availability",
        leftKey: "id_availability",
        foreign_name: "name"
      },
      {
        type: "1-1",
        name: "city",
        entity: "city",
        leftKey: "id_city",
        foreign_name: "name"
      },
      {
        type: "1-1",
        name: "region",
        entity: "region",
        leftKey: "id_region",
        foreign_name: "name"
      },
      {
        type: "1-1",
        name: "country",
        entity: "country",
        leftKey: "id_country",
        foreign_name: "name"
      },
      {
        type: "1-1",
        name: "type_document",
        entity: "type_document",
        leftKey: "id_type_document",
        foreign_name: "name"
      },
      {
        type: "n-n",
        entity: "institution",
        name: "institutions",
        intermediate: {
          entity: "institution_user",
          leftKey: "id_user",
          rightKey: "id_institution",

        }
      },
      {
        type: "1-n",
        name: "record_points",
        rightKey: "id_user",
        entity: "points"
      },
      {
        type: "1-n",
        name: "requests",
        rightKey: "id_user",
        entity: "evaluation_request"
      },
    ]
  },
  "role":{
    table: "role",
    relations: [
      {
        type: "n-n",
        entity: "permission",
        name: "permissions",
        intermediate: {
          entity: "permission_role",
          leftKey: "id_role",
          rightKey: "id_permission"
        }
      },
    ]
  },
  "user_role": {
    table: "user_role",
    relations: [
      {
        type: "1-1",
        name: "user",
        entity: "user",
        leftKey: "id_user",
        foreign_name: "name"
      },
      {
        type: "1-1",
        name: "role",
        entity: "role",
        leftKey: "id_role",
        foreign_name: "name"
      }
    ]
  },
  "permission_role": {
    table: "permission_role",
    relations: [
      {
        type: "1-1",
        name: "permission",
        entity: "permission",
        leftKey: "id_permission",
        foreign_name: "name"
      },
      {
        type: "1-1",
        name: "role",
        entity: "role",
        leftKey: "id_role",
        foreign_name: "name"
      }
    ]
  },
  "service": {
    table: "service",
    relations: [
      {
        type: "1-1",
        name: "category",
        foreign_name: "name",
        entity: "category",
        leftKey: "id_category"
      },
      {
        type: "1-1",
        name: "institution",
        foreign_name: "name",
        entity: "institution",
        leftKey: "id_institution"
      },
      {
        type: "1-n",
        name: "history",
        rightKey: "id_service",
        entity: "service_status"
      },
      {
        type: "1-1",
        name: "status",
        leftKey: "current_status",
        foreign_name: "name",
        entity: "status"
      },
      {
        type: "1-n",
        name: "comments",
        entity: "service_comment",
        rightKey: "id_service"
      },
      {
        type: "1-n",
        name: "requisites",
        rightKey: "id_service",
        entity: "user_answer"
      },
    ]
  },
  "service_comment": {
    table: "service_comment",
    relations: [
      {
        type: "1-1",
        entity: "user",
        name: "user",
        leftKey: "id_user",
        foreign_name: "email"
      },
      {
        type: "1-1",
        name: "service",
        entity: "service",
        leftKey: "id_service",
        foreign_name: "name"
      }
    ]
  },
  "service_status": {
    table: "service_status",
    relations: [
      {
        type: "1-1",
        name: "status",
        foreign_name: "name",
        entity: "status",
        leftKey: "id_status"
      }
    ]
  },
  "evaluation_request": {
    table: "evaluation_request",
    relations: [
      {
        type: "1-1",
        name: "user",
        entity: "user",
        leftKey: "id_user",
        foreign_name: "email"
      },
      {
        type: "1-1",
        name: "service",
        entity: "service",
        leftKey: "id_service",
        foreign_name: "name"
      },
      {
        type: "1-1",
        name: "status",
        entity: "request_status",
        leftKey: "id_request_status",
        foreign_name: "name"
      }
    ]
  },
  "institution": {
    table: "institution",
    relations: [
      {
        type: "1-1",
        entity: "city",
        name: "city",
        leftKey: "id_city",
        foreign_name: "name"
      },
      {
        type: "1-1",
        entity: "region",
        name: "region",
        leftKey: "id_region",
        foreign_name: "name"
      },
      {
        type: "1-1",
        entity: "country",
        name: "country",
        leftKey: "id_country",
        foreign_name: "name"
      },
      {
        type: "1-1",
        entity: "institutionType",
        name: "type",
        leftKey: "id_institution_type",
        foreign_name: "name"
      },
      {
        type: "n-n",
        name: "users",
        entity: "user",
        intermediate: {
          entity: "institution_user",
          leftKey: "id_institution",
          rightKey: "id_user"
        }
      },
      {
        type: "1-n",
        name: "service",
        rightKey: "id_institution",
        entity: "service"
      },
      {
        type: "1-n",
        name: "points",
        rightKey: "id_institution",
        entity: "points"
      },
    ]
  },
  "institution_user": {
    table: "institution_user",
    relations: [
      {
        type: "1-1",
        entity: "institution",
        name: "institution",
        leftKey: "id_institution",
        foreign_name: "name"
      },
      {
        type: "1-1",
        entity: "user",
        name: "user",
        leftKey: "id_user",
        foreign_name: "email"
      }
    ]
  },
  "city": {
    table: "city",
    relations: [
      {
        type: "1-1",
        entity: "region",
        name: "region",
        leftKey: "id_region",
        foreign_name: "name"
      }
    ]
  },
  "region":{
    table:"region",
    relations: [
      {
        type: "1-1",
        entity: "country",
        name: "country",
        leftKey: "id_country",
        foreign_name: "name"
      },
      {
        type: "1-1",
        entity: "city",
        name: "capital",
        leftKey: "id_capital",
        foreign_name: "name"
      }
    ]
  },
  "country":{
    table:"country",
    relations: [
      {
        type: "1-1",
        entity: "city",
        name: "capital",
        leftKey: "id_capital",
        foreign_name: "name"
      }
    ]
  },
  "banner":{
    table:"banner",
    relations:[
      {
        type:"1-1",
        entity:"type_banner",
        name:"type",
        leftKey:"id_type_banner",
        foreign_name:"name"
      }
    ]
  },
  "hangouts":{
    table:"hangouts",
    relations:[
      {
        type:"1-1",
        entity:"role",
        name:"role",
        leftKey:"id_role",
        foreign_name:"name"
      }
    ]
  },
  "form": {
    table: "form",
    relations: [
      {
        type: "1-1",
        name: "category",
        entity: "category",
        leftKey: "id_category",
        foreign_name: "name"
      },
    ]
  },
  "questiontopic": {
    table: "questiontopic",
    relations: [
      {
        type: "1-1",
        name: "user_type",
        entity: "usertype",
        leftKey: "id_usertype",
        foreign_name: "name"
      },
      {
        type: "1-1",
        name: "category",
        entity: "category",
        leftKey: "id_category",
        foreign_name: "name"
      },
    ]
  },
  "question": {
    table: "question",
    relations: [
      {
        type: "1-1",
        name: "topic",
        entity: "questiontopic",
        leftKey: "id_topic",
        foreign_name: "name"
      },
    ]
  },
  "category_question": {
    table: "category_questions",
    relations: [
      {
        type: "1-1",
        name: "category",
        entity: "category",
        leftKey: "id_category",
        foreign_name: "name"
      },
    ]
  },
  "user_answer":{
    table:"user_answer",
    relations:[
      {
        type:"1-1",
        entity:"service",
        name:"service",
        leftKey:"id_service",
        foreign_name:"name"
      },
      {
        type:"1-1",
        entity:"question",
        leftKey:"id_question",
        name:"question",
        foreign_name:"text"
      },
      {
        type:"1-1",
        entity:"user",
        name:"user",
        leftKey:"id_user",
        foreign_name:"email"
      },
      {
        type:"1-1",
        entity:"media",
        name:"media",
        leftKey:"id_media",
        foreign_name:"url"
      },
      {
        type:"1-1",
        entity:"questiontopic",
        name:"topic",
        leftKey:"id_topic",
        foreign_name:"name"
      },
      {
        type:"1-1",
        entity:"request_status",
        name:"status",
        leftKey:"id_status",
        foreign_name:"name"
      },
      {
        type:"1-n",
        entity:"evaluation_request",
        name:"evaluators",
        rightKey:"id_answer",
        foreign_name:"id_user"
      }
    ]
  },
  "hall_of_fame":{
    table:"hall_of_fame",
    relations:[
      {
        type:"1-1",
        entity:"role",
        name:"role",
        leftKey:"id_role",
        foreign_name:"name"
      },
    ]
  },
  "motives":{
    table:"motives",
    relations:[
      {
        type:"1-1",
        entity:"motivename",
        name:"name",
        leftKey:"id_name",
        foreign_name:"name"
      },
      {
        type:"1-1",
        entity:"category",
        name:"category",
        leftKey:"id_category",
        foreign_name:"name"
      },
      {
        type:"1-1",
        entity:"role",
        leftKey:"id_role",
        name:"role",
        foreign_name:"name"
      }
    ]
  },
  "evaluation_request":{
    table:"evaluation_request",
    relations:[
      {
        type:"1-1",
        entity:"user",
        leftKey:"id_user",
        name:"user",
        foreign_name:"email"
      },
      {
        type:"1-1",
        entity:"user_answer",
        leftKey:"id_answer",
        name:"user_answer",
        foreign_name:"name"
      },
      {
        type:"1-1",
        entity:"question",
        leftKey:"id_question",
        name:"question",
        foreign_name:"name"
      },
      {
        type:"1-1",
        entity:"service",
        leftKey:"id_service",
        name:"service",
        foreign_name:"name"
      },
      {
        type:"1-1",
        entity:"request_status",
        leftKey:"id_request_status",
        name:"status",
        foreign_name:"name"
      },
      {
        type:"1-n",
        entity:"chats",
        name:"chats",
        rightKey:"id_evaluation_request"
      }
    ]
  },
  "points":{
    table:"points",
    relations:[
      {
        type:"1-1",
        entity:"motives",
        name:"motives",
        leftKey:"id_motives",
        foreign_name:"name"
      }
    ]
  },
}
try {
  module.exports = dmt;
} catch (e) {
  console.log(e);
}
