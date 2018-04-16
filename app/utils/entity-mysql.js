var config = require('../../config.json')
var verbose = config.verbose === true
var emiter = require('../events/emiter.js').instance
var mysql = require('mysql')

var dbConf = null;
var env = "db_" + config.enviroment;
dbConf = config[env]
dbConf.multipleStatements = true
var pool = mysql.createPool(dbConf)

var EntityModel = function (info) {
	let dmt_entities = require('../../public/admin/entities.js')
	let dmt_tables = require('../../public/admin/tables.js')
	let dmt = {
		entities: dmt_entities.entities,
		tables: dmt_tables.tables
	}
	this.getPrimaryKey = function () {
		let key = null
		getTable(info.entity).fields.forEach((f) => {
			if (f.key) {
				key = f.name
			}
		})
		return key
	}
	function getTable(name) {
		let ety = dmt.entities[name]
		let table = null
		if (ety) {
			table = dmt.tables[ety.table]
			if (!table) {
				console.log(name)
			}
			table.name = ety.table
			return table
		} else {
			table = dmt.tables[name]
			if (!table) {
				console.error(name)
			}
			table.name = name
			return table
		}
	}
	function resolveViewName(entity, lang) {
		let ety = dmt.entities[entity]
		if (ety) {
			if (ety.translate && lang) {
				return "view_" + ety.table + "_" + lang
			} else {
				return "view_" + ety.table
			}
		}
		return entity
	}
	function getFields(relation) {
		let str = [];
		let table = getTable(relation.entity || relation.table)
		let name = ''
		if (relation.name) {
			name = '_' + relation.name
		}
		table.fields.forEach((f) => {
			str.push('`' + table.name + name + "`.`" + f.name + "` `" + table.name + name + "_" + f.name + "`")
		})
		return str.join(",")
	}
	function resolveQuery(query, connection) {
		return new Promise((resolve, reject) => {
			if (verbose) console.log(query)
			connection.query(query, (err, result, fields) => {
				if (err) reject(err)
				else resolve(result)
				connection.release()
			})
		})
	}
	function getBase(lang) {
		return `(SELECT ${info.table}.*,${getFields(info.translate)} FROM  ${info.table}
				 LEFT JOIN ${info.translate.table}  ON ${info.translate.table}.${info.translate.rightKey} = ${info.table}.${getTable(info.table).defaultSort} AND ${info.translate.table}.id_lang = '${lang}')`;
	}

	function generateGetQuery(base, lang) {
		let selection = "\`base\`.*";
		if (base.indexOf('(SELECT') === -1) {
			base = '`' + base + '`'
		}
		let get_query = `SELECT {{SELECTION}} FROM ${base} \`base\` `;
		if (info.relations) {
			info.relations.forEach((relation) => {
				if (relation.type === '1-1') {
					if (dmt.entities[relation.entity] && dmt.entities[relation.entity].translate && relation.entity != info.entity) {
						let ety = dmt.entities[relation.entity]
						let view = resolveViewName(relation.entity, lang)
						let baseTable = getTable(relation.entity)
						let translateTable = getTable(ety.translate.table)
						let fields = []
						baseTable.fields.forEach((f) => {
							if (f.name !== relation.leftKey) {
								//fields.push(view + '.' + f.name + ' ' + baseTable.name + '_' + f.name)
								fields.push('`' + view + '_' + relation.name + '`.`' + f.name + '` `' + baseTable.name + '_' + relation.name + '_' + f.name + '`')
							}
						})
						translateTable.fields.forEach((f) => {
							if (f.name !== ety.translate.rightKey) {
								fields.push('`' + view + '`.`' + translateTable.name + "_" + f.name + '` `' + baseTable.name + '_' + f.name + '`')
							}
						})
						selection += `,${fields.join(',')} `
						get_query += `LEFT JOIN \`${view}\` \`${view}_${relation.name}\` ON \`base\`.\`${relation.leftKey}\` = \`${view}_${relation.name}\`.\`${baseTable.defaultSort}\` `
					} else {
						selection += `,${getFields(relation)} `
						let table = getTable(relation.entity)
						get_query += `LEFT JOIN \`${table.name}\` \`${table.name}_${relation.name}\` ON \`base\`.\`${relation.leftKey}\` = \`${table.name}_${relation.name}\`.\`${table.defaultSort}\` `
					}
				}
			})
		}
		get_query = get_query.replace(new RegExp("{{SELECTION}}", "g"), selection);
		let query = `CREATE OR REPLACE VIEW view_${info.table}${lang ? "_" + lang : ""} AS ${get_query};`;
		return query
	}
	this.updateView = function () {
		if (info.translate) {
			return this.customQuery("SELECT * FROM lang").then((langs) => {
				let query = "";
				langs.forEach((l) => {
					query += generateGetQuery(getBase(l.code), l.code)
				})
				if (query.length) {
					return this.customQuery(query)
				}
				return
			})
		} else {
			let query = generateGetQuery(info.table, null)
			return this.customQuery(query)
		}
	}
	this.getAll = function (params) {
		params = params || {
			limit: 10,
			page: 1
		}
		return this.getFiltered(params)
	}
	this.getByUid = function (uid) {
		let table = getTable(info.entity)
		let params = {
			filter_fields: [table.defaultSort],
			filter_values: [uid],
			simple: false
		}
		return this.getFiltered(params)
	}
	this.getByUids = function (uids) {
		return new Promise((resolve, reject) => {
			pool.getConnection((err, connection) => {
				if (err) { reject(err) }
				var queryGet = ''
				for (var i in uids) {
					queryGet += 'list.Uid = ' + connection.escape(uids[i]) + ' AND '
				}
				queryGet = queryGet.slice(0, -4)
				var query = 'SELECT * FROM `' + info.table + '` AS list WHERE ' + queryGet + ''
				resolveQuery(query, connection).then(resolve, reject)
			})
		})
	}
	this.getByParams = function (params, simple) {
		let _params = {
			filter_fields: [],
			filter_values: [],
			simple: simple
		}
		for (var i in params) {
			if (params[i] instanceof Array) {
				for (var j in params[i]) {
					_params.filter_fields.push(i)
					_params.filter_values.push(params[i][j])
				}
			} else {
				_params.filter_fields.push(i)

				_params.filter_values.push(params[i])
			}
		}
		return this.getFiltered(_params)
	}
	/**
			 * From row to json
			 */
	this.sintetizeRelation = function (data, relation) {
		let ety = dmt.entities[relation.entity]
		let table = getTable(relation.entity)
		let result = {}
		table.fields.forEach((f) => {//base data
			if (f.name === "password") { return } //wont return any password
			result[f.name] = data[f.name]
		})
		if (!ety) {
			return result
		}
		if (ety.translate) {
			let translate_table = getTable(ety.translate.table)
			translate_table.fields.forEach((f) => {
				if (!result[f.name]) {
					result[f.name] = data[translate_table.name + "_" + f.name]
				}
			})
		}
		if (ety.relations) {
			ety.relations.forEach((relation) => {
				if (relation.type === "1-1") {
					let object = {}
					let ety = dmt.entities[relation.entity]
					let relation_table = getTable(relation.entity || relation.table)

					let fields = relation_table.fields
					if (ety && ety.translate) {
						let translate_table = getTable(ety.translate.table)
						fields = fields.concat(translate_table.fields)
					}
					fields.forEach((f) => {
						if (f.name === "password") { return }
						if (!object[f.name]) {
							object[f.name] = data[relation_table.name + '_' + relation.name + '_' + f.name]
						}
					})
					result[relation.name || relation.entity] = object
				}
			})
		}
		if (relation.intermediate) {
			result[getTable(info.table).defaultSort] = result[getTable(info.table).defaultSort] || data[relation.intermediate.leftKey]
		}
		return result
	}
	this.getFiltered = function (params) {
		return new Promise((resolve, reject) => {
			pool.getConnection((err, connection) => {
				if (err) { reject(err) }
				let filters = {}
				var relation_filters = {}
				var where = ""
				params.limit = params.limit || 20
				params.page = params.page || 1
				params.lang = params.lang || 'es'
				params._join = params._join || 'OR'
				if (params.simple === undefined) {
					params.simple = true
				}
				params.simple = JSON.parse(params.simple)
				params.order = params.order || getTable(info.entity).defaultSort
				params.filter_fields = params.filter_fields || []
				params.filter_values = params.filter_values || []
				if (typeof params.filter_fields == "string") {
					params.filter_fields = [params.filter_fields]
					params.filter_values = [params.filter_values]
				}
				params.fields = params.fields || []
				if (typeof params.fields == "string") {
					params.fields = [params.fields]
				}
				if (params.order.indexOf('-') === 0) {
					params.order = params.order.substring(1) + ' desc'
				}
				function resolveEqual(connection, value, equal) {
					if (typeof value != 'string') {
						return equal + connection.escape(value);
					}
					let array = value.split(" ");
					if (array.length > 1) {
						equal = array.splice(0, 1)
						return equal + connection.escape(array.join(' '));
					}
					return equal + connection.escape(value);
				}

				//group fields by name
				params.filter_fields.forEach((key, i) => {
					if (key.indexOf(".") !== -1) {
						let rel = key.split(".")
						let rel_name = rel[0]
						let rel_field = rel[1]
						if (!relation_filters[rel_name]) {
							relation_filters[rel_name] = {}
						}
						if (!relation_filters[rel_name][rel_field]) {
							relation_filters[rel_name][rel_field] = []
						}
						//relation_filters[rel_name][rel_field].push(connection.escape(params.filter_values[i]))
						relation_filters[rel_name][rel_field].push(resolveEqual(connection, params.filter_values[i], ''))
					} else {
						if (!filters[key]) {
							filters[key] = []
						}
						filters[key].push(resolveEqual(connection, params.filter_values[i], '= '))
					}

				})

				let search = ""
				if (params.filter && params.filter.length > 0) {
					let ety = dmt.entities[info.entity]
					let view = resolveViewName(info.entity, params.lang)
					let baseTable = getTable(info.entity)
					let translateTable = null
					if (ety && ety.translate)
						translateTable = getTable(ety.translate.table)
					let fields = []
					baseTable.fields.forEach((f) => {
						if (f.type === "string" || f.type === "text") {
							fields.push('`' + view + '`.`' + f.name + '`')
						}
					})
					if (translateTable) {
						translateTable.fields.forEach((f) => {
							if (f.name !== ety.translate.rightKey && (f.type === "string" || f.type === "text")) {
								fields.push(translateTable.name + '_' + f.name)
							}
						})
					}
					if (info.relations && params.simple === false) {
						info.relations.forEach((relation) => {
							let table = getTable(relation.entity || relation.table)
							let view = resolveViewName(relation.entity || relation.table, params.lang) + '_' + relation.name
							table.fields.forEach((f) => {
								if (f.type === "string" || f.type === "text") {
									fields.push('`' + view + '`.`' + f.name + '`')
								}
							})
						})
					}
					search = []
					for (var i in fields) {
						// TODO CREATE FULLTEXT INDEX AND USE MATCH IN NATURAL LANGUAGE MODE
						search.push(fields[i] + " like " + connection.escape("%" + params.filter.split(" ").join("%") + "%"))
						//search.push('`' + view + '`.`' + fields[i] + "` like " + connection.escape("%" + params.filter.split(" ").join("%") + "%"))
					}
					search = "(" + search.join(" OR ") + ")"
				}

				let conditions = ""
				if (params.filter_fields.length > 0) {
					let view = resolveViewName(info.entity, params.lang)
					for (var f in filters) {
						conditions += "("
						for (var v in filters[f]) {
							conditions += '`' + view + '`.`' + f + '`' + filters[f][v] + " " + params._join + " "
						}
						conditions = conditions.slice(0, -4)
						conditions += ') AND '
					}
				}

				let vname = '`' + resolveViewName(info.entity, params.lang) + '`'
				let subtable = vname
				/**
				 * Support for filters into n-n  and 1-n relations
				 */
				let intermediate = 0
				if (info.relations && params.simple === false) {
					info.relations.forEach((relation) => {
						let name = resolveViewName(relation.entity, params.lang)
						for (let r in relation_filters) {
							console.warn("Doing relation filters can reduce the performance")
							if (relation.name == r) {
								conditions += '('
								for (let k in relation_filters[r]) {
									if (relation_filters[r][k][0].indexOf('\'') == 0) {
										conditions += `\`${name + '_' + relation.name + '`.`' + k}\` IN ( ${relation_filters[r][k]} ) AND `
									} else {
										for (var l in relation_filters[r][k]) {
											let v = relation_filters[r][k][l]
											conditions += `\`${name + '_' + relation.name + '`.`' + k}\` ${v} AND `
										}
									}
								}
								conditions = conditions.slice(0, -4) + ') AND '
							}
						}
						let joins = []
						if (relation.intermediate) { // n-n relation 
							let iname = resolveViewName(relation.intermediate.entity, params.lang)
							joins.push(`LEFT JOIN \`${iname}\` \`intermediate_${intermediate}\` ON \`intermediate_${intermediate}\`.\`${relation.intermediate.leftKey}\` = ${vname}.\`${getTable(info.table).defaultSort}\`
							LEFT JOIN \`${name}\` \`${name + '_' + relation.name}\` ON \`intermediate_${intermediate}\`.\`${relation.intermediate.rightKey}\` = \`${name + '_' + relation.name}\`.\`${getTable(relation.entity).defaultSort}\``)
						} else if (relation.rightKey) { //1-n relation
							joins.push(`LEFT JOIN \`${name}\` \`${name + '_' + relation.name}\` ON \`${name + '_' + relation.name}\`.\`${relation.rightKey}\` = ${vname}.\`${getTable(info.table).defaultSort}\``)
						} else if (relation.leftKey) { // 1-1 and  
							let relation_table = getTable(relation.entity || relation.table)
							joins.push(`LEFT JOIN \`${name}\` \`${name + '_' + relation.name}\` ON \`${name + '_' + relation.name}\`.\`${relation_table.defaultSort}\` = ${vname}.\`${relation.leftKey}\``)
						}
						subtable = subtable + ' ' + joins
						intermediate++
					})
				}
				conditions = conditions.slice(0, -5)
				if (search.length > 0 && conditions.length > 0) {
					where = search + " AND " + conditions
				} else { //just one of these
					where = search + conditions
				}

				var query = "SELECT SQL_CALC_FOUND_ROWS `" + resolveViewName(info.entity, params.lang) + "`.`" + getTable(info.table).defaultSort + "` `key` FROM " + subtable + " "
				if (where.length > 2) {
					query += "WHERE " + where
				}
				query += "GROUP BY `key` "
				query += "ORDER BY `" + resolveViewName(info.entity, params.lang) + "`." + params.order + " LIMIT " + ((parseInt(params.page) - 1) * params.limit) + "," + params.limit + ";"
				query += "SELECT FOUND_ROWS() as total"
				return resolveQuery(query, connection).then((result) => {
					let keys = []
					for (let i in result[0]) {
						keys.push(result[0][i].key)
					}
					let total = result[1][0].total
					if (keys.length === 0) {
						resolve({ data: [], total_results: 0 })
						return
					}
					keys = keys.join(",")
					query = "SELECT * FROM `" + resolveViewName(info.entity, params.lang) + "` WHERE `" + getTable(info.table).defaultSort + "` IN (" + keys + ") ORDER BY " + params.order + ";"
					let count = 0;
					if (params.simple === false) {
						if (info.relations) {
							for (let i = 0; i < info.relations.length; i++) {
								let relation = info.relations[i]
								//info.relations.forEach((relation) =>
								switch (relation.type) {
									case "1-n":
										count++;
										query += `SELECT * FROM \`${resolveViewName(relation.entity, params.lang)}\` WHERE \`${resolveViewName(relation.entity, params.lang)}\`.\`${relation.rightKey}\` IN (${keys});`
										break;
									case "n-n":
										count++;
										query += `SELECT * FROM \`${resolveViewName(relation.entity, params.lang)}\`
							LEFT JOIN \`${resolveViewName(relation.intermediate.entity, params.lang)}\` \`intermediate\` ON \`intermediate\`.\`${relation.intermediate.rightKey}\` = \`${resolveViewName(relation.entity, params.lang)}\`.\`${getTable(relation.entity).defaultSort}\`
							WHERE \`intermediate\`.\`${relation.intermediate.leftKey}\` IN (${keys});`
										break;
								}
							}
						}
					}
					return this.customQuery(query)
						.then((result) => {
							let data = null
							if (count == 0) {
								data = result;
								delete data.password;
							} else {
								data = result[0];
							}
							//sintetize relations
							let relations = {};
							let relationlist = []
							if (info.relations) {
								info.relations.forEach((relation) => {
									if (relation.type === "1-1")
										return
									relationlist.push(relation)
								})
								for (let i = 1; i < result.length; i++) {
									let table = result[i]
									for (let j = 0; j < table.length; j++) {
										let relation = relationlist[i - 1]
										let entity = this.sintetizeRelation(table[j], relation)
										//let key = entity[getTable(info.table).defaultSort]
										let key = relation.rightKey
										if (relation.intermediate) {
											key = relation.intermediate.leftKey
										}
										key = table[j][key]
										if (!relations[key]) {
											relations[key] = {}
										}
										if (!relations[key][relation.name]) {
											relations[key][relation.name] = []
										}
										relations[key][relation.name].push(entity)
									}
								}
							}
							let results = []
							for (let i = 0; i < data.length; i++) {
								let row = this.sintetizeRelation(data[i], info)
								let key = row[getTable(info.table).defaultSort]
								if (relations[key]) {
									for (j in relations[key]) {
										row[j] = relations[key][j]
									}
								}
								results.push(row)
							}
							resolve({ data: results, total_results: total })
						}, reject)
				}, reject)
			})
		})
	}
	this.createMultiple = function (data) {
		let rows = data.data
		let col_names = data.col_names
		var query = "INSERT INTO " + info.table + " (" + col_names.join(",") + ") VALUES "
		for (let i in rows) {
			query += "(" //init
			for (let j in col_names) {
				if (rows[i][col_names[j]] === undefined) {
					query += "NULL,"
				} else {
					query += "'" + rows[i][col_names[j]] + "',"
				}
			}
			query = query.slice(0, -1)
			query += "),"
		}
		query = query.slice(0, -1)
		return this.customQuery(query)
	}
	function insertIntoTable(table, data, connection) {
		var queryFields = '('
		var queryValues = '('
		table.fields.forEach((f) => {
			if (!data[f.name]) {
				return
			}
			if (f.type === 'boolean' && typeof data[f.name] == "string") {
				data[f.name] = data[f.name] === "true" || data[f.name] === "1"
			}
			if (f.type === 'datetime' || f.type === 'date' || f.type === 'timestamp') {
				data[f.name] = new Date(data[f.name])
			}
			if (data[f.name] === "null") {
				data[f.name] = null
			}
			queryFields += '`' + f.name + '`' + ','
			queryValues += connection.escape(data[f.name]) + ','
		})
		queryFields = queryFields.slice(0, -1) + ')'
		queryValues = queryValues.slice(0, -1) + ')'
		var query = 'INSERT INTO `' + table.name + '` ' + queryFields + ' VALUES ' + queryValues + ''
		return query
	}
	function updateTable(table, data, connection, condition) {
		var queryValues = ''
		var queryWhere = '('
		table.fields.forEach((f) => {
			if (!data[f.name]) {
				return
			}
			if (f.name == 'timestamp') {
				return
			}
			if (f.type === 'boolean' && typeof data[f.name] == "string") {
				data[f.name] = data[f.name] === "true" || data[f.name] === "1"
			}
			if (f.type === 'datetime' || f.type === 'date' || f.type === 'timestamp') {
				data[f.name] = new Date(data[f.name])
			}
			if (data[f.name] === "null") {
				data[f.name] = null
			}
			queryValues += '`' + f.name + '`' + '=' + connection.escape(data[f.name]) + ','
			if (f.key && !condition) {
				queryWhere += '`' + f.name + '`=' + connection.escape(data[f.name]) + ' AND '
			}
		})
		if (condition) {
			for (var j in condition) {
				queryWhere += '`' + j + '`=' + connection.escape(condition[j]) + ' AND '
			}
		}
		queryValues = queryValues.slice(0, -1)
		queryWhere = queryWhere.slice(0, -5) + ')'
		var query = 'UPDATE `' + table.name + '` SET ' + queryValues + ' WHERE ' + queryWhere
		return query
	}
	function updateIntermediates(relation, baseId, intermediates) {
		let query = "DELETE FROM `" + relation.table + "` WHERE `" + relation.leftKey + "`= '" + baseId + "'"
		return this.customQuery(query).then(() => {
			let values = ""
			for (let i in intermediates) {
				values += "(" + baseId, intermediates[i] + "),"
			}
			values = values.slice(0, -1)
			let query = "INSERT INTO `" + relation.table + "` (" + relation.leftKey + "," + relation.rightKey + ") VALUES (" + values + ")"
			return this.customQuery(query)
		})
	}
	this.create = function (body) {
		let uid = null
		return new Promise((resolve, reject) => {
			pool.getConnection((err, connection) => {
				if (err) { reject(err) }
				let entity = dmt.entities[info.entity]
				let table = getTable(info.entity)
				return resolveQuery(insertIntoTable(table, body, connection), connection)
					.then((base) => {
						if (base.insertId) {
							body[table.defaultSort] = base.insertId
							uid = base.insertId
						}
						if (entity.translate) {
							return new Promise((resolve, reject) => {
								pool.getConnection((err, connection) => {
									if (err) { reject(err) }
									resolveQuery(updateTranslation(body, connection), connection)
										.then(resolve, reject)
								})
							})
						} else {
							return
						}
					}, reject).then(() => {
						return this.updateView()
					})
					.then(() => {
						if (uid) {
							return this.getByUid(uid)
						}
						return { data: [body] }
					}, reject).then((result) => {
						let item = result.data[0]
						emiter.emit(info.entity + '.created', item)
						resolve(item)
					}, reject)
			})
		})
	}
	function updateTranslation(body, connection) {
		let lang = body.language
		let entity = dmt.entities[info.entity]
		let table = getTable(info.entity)

		let translate_table = dmt.tables[entity.translate.table]
		let where = ' WHERE ' + entity.translate.rightKey + '=' + body[table.defaultSort] + ' AND id_lang =\'' + lang + '\''
		let query = 'DELETE FROM ' + entity.translate.table + where + '; INSERT INTO ' + entity.translate.table + ' '
		let keys = '('
		let values = '('
		body.id_lang = lang
		body[entity.translate.rightKey] = body[table.defaultSort]
		translate_table.fields.forEach((f) => {
			keys += '`' + f.name + '`,'
			values += connection.escape(body[f.name]) + ','
		})
		keys = keys.slice(0, -1) + ')'
		values = values.slice(0, -1) + ')'
		query += keys + ' VALUES ' + values
		query = "SET FOREIGN_KEY_CHECKS= 0;" + query + ";SET FOREIGN_KEY_CHECKS = 1;";
		return query
	}
	this.update = function (body, condition) {
		let entity = dmt.entities[info.entity]
		let table = getTable(info.entity)
		let old = null
		return this.getByParams(condition).then((result) => {
			old = result.data[0]
			return new Promise((resolve, reject) => {
				pool.getConnection((err, connection) => {
					if (err) { reject(err) }
					resolveQuery(updateTable(table, body, connection, condition), connection).then((results) => {
						if (entity.translate) {
							return new Promise((resolve, reject) => {
								pool.getConnection((err, connection) => {
									if (err) { reject(err) }
									resolveQuery(updateTranslation(body, connection), connection).then(resolve, reject)
								})
							})
						} else {
							return
						}
					}, reject).then(() => {
						return this.updateView()
					}, reject).then(() => {
						let key = body[this.getPrimaryKey()]
						if (key) {
							return this.getByUid(key)
						}
						return null
					}, reject).then((result) => {
						let _new = null
						if (result && result.data) {
							_new = result.data[0]
							emiter.emit(info.entity + '.updated', old, _new, body)
						}
						resolve(_new)
					}, reject)
				})
			})
		})
	}
	this.delete = function (condition) {
		let table = getTable(info.entity)
		let data = {}
		table.fields.forEach((f) => {
			if (condition[f.name]) {
				data[f.name] = condition[f.name]
			}
		})
		return new Promise((resolve, reject) => {
			pool.getConnection((err, connection) => {
				if (err) { reject(err) }
				var queryCondition = ''
				function resolveEqual(connection, value, equal) {
					if (typeof value != 'string') {
						return equal + connection.escape(value);
					}
					let array = value.split(" ");
					if (array.length > 1) {
						equal = array.splice(0, 1)
						return equal + connection.escape(array.join(' '));
					}
					return equal + connection.escape(value);
				}
				for (var i in data) {
					//i + ' = ' + connection.escape(data[i]) +
					queryCondition += i + resolveEqual(connection, data[i], ' = ') + ' AND '
				}
				queryCondition = queryCondition.slice(0, -4)
				var query0 = 'SELECT * FROM ' + info.table + ' WHERE ' + queryCondition + ''
				var query1 = 'DELETE FROM ' + info.table + ' WHERE ' + queryCondition + ''
				query1 = "SET FOREIGN_KEY_CHECKS= 0;" + query1 + ";SET FOREIGN_KEY_CHECKS = 1;";
				return resolveQuery(query0, connection).then((results) => {
					emiter.emit(info.entity + '.deleted', results[0])
					return this.customQuery(query1)
				}, reject).then(() => {
					this.updateView()
					resolve()
				}, reject)
			})
		})
	}
	this.customQuery = function (query) {
		return new Promise((resolve, reject) => {
			pool.getConnection((err, connection) => {
				if (err) { reject(err) }
				resolveQuery(query, connection).then(resolve, reject)
			})
		})
	}
}

module.exports = EntityModel
