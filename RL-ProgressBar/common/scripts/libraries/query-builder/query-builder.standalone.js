/*!
 * jQuery.extendext 0.1.1
 *
 * Copyright 2014 Damien "Mistic" Sorel (http://www.strangeplanet.fr)
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 * 
 * Based on jQuery.extend by jQuery Foundation, Inc. and other contributors
 */

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('jQuery.extendext', ['jquery'], factory);
    }
    else {
        factory(root.jQuery);
    }
}(this, function($) {
  "use strict";

  $.extendext = function() {
    var options, name, src, copy, copyIsArray, clone,
      target = arguments[0] || {},
      i = 1,
      length = arguments.length,
      deep = false,
      arrayMode = 'default';

    // Handle a deep copy situation
    if ( typeof target === "boolean" ) {
      deep = target;

      // Skip the boolean and the target
      target = arguments[ i++ ] || {};
    }

    // Handle array mode parameter
    if ( typeof target === "string" ) {
      arrayMode = $([target.toLowerCase(), 'default']).filter(['default','concat','replace','extend'])[0];

      // Skip the string param
      target = arguments[ i++ ] || {};
    }

    // Handle case when target is a string or something (possible in deep copy)
    if ( typeof target !== "object" && !$.isFunction(target) ) {
      target = {};
    }

    // Extend jQuery itself if only one argument is passed
    if ( i === length ) {
      target = this;
      i--;
    }

    for ( ; i < length; i++ ) {
      // Only deal with non-null/undefined values
      if ( (options = arguments[ i ]) !== null ) {
        // Special operations for arrays
        if ($.isArray(options) && arrayMode !== 'default') {
          clone = target && $.isArray(target) ? target : [];

          switch (arrayMode) {
          case 'concat':
            target = clone.concat( $.extend( deep, [], options ) );
            break;

          case 'replace':
            target = $.extend( deep, [], options );
            break;

          case 'extend':
            options.forEach(function(e, i) {
              if (typeof e === 'object') {
                var type = $.isArray(e) ? [] : {};
                clone[i] = $.extendext( deep, arrayMode, clone[i] || type, e );

              } else if (clone.indexOf(e) === -1) {
                clone.push(e);
              }
            });

            target = clone;
            break;
          }

        } else {
          // Extend the base object
          for ( name in options ) {
            src = target[ name ];
            copy = options[ name ];

            // Prevent never-ending loop
            if ( target === copy ) {
              continue;
            }

            // Recurse if we're merging plain objects or arrays
            if ( deep && copy && ( $.isPlainObject(copy) ||
              (copyIsArray = $.isArray(copy)) ) ) {

              if ( copyIsArray ) {
                copyIsArray = false;
                clone = src && $.isArray(src) ? src : [];

              } else {
                clone = src && $.isPlainObject(src) ? src : {};
              }

              // Never move original objects, clone them
              target[ name ] = $.extendext( deep, arrayMode, clone, copy );

            // Don't bring in undefined values
            } else if ( copy !== undefined ) {
              target[ name ] = copy;
            }
          }
        }
      }
    }

    // Return the modified object
    return target;
  };
}));

/*!
 * jQuery QueryBuilder 2.0.1
 * Copyright 2014-2015 Damien "Mistic" Sorel (http://www.strangeplanet.fr)
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */

// Modules: bt-checkbox, bt-selectpicker, bt-tooltip-errors, filter-description, loopback-support, mongodb-support, sortable, sql-support, unique-filter
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('query-builder', ['jquery', 'jQuery.extendext'], factory);
    }
    else {
        factory(root.jQuery);
    }
}(this, function($) {
"use strict";

// CLASS DEFINITION
// ===============================
var QueryBuilder = function($el, options) {
    this.init($el, options);
};


// EVENTS SYSTEM
// ===============================
var aps = Array.prototype.slice;

$.extend(QueryBuilder.prototype, {
    change: function(type, value) {
        var event = new $.Event(type + '.queryBuilder.filter', {
            builder: this,
            value: value
        });

        this.$el.triggerHandler(event, aps.call(arguments, 2));

        return event.value;
    },

    trigger: function(type) {
        var event = new $.Event(type + '.queryBuilder', {
            builder: this
        });

        this.$el.triggerHandler(event, aps.call(arguments, 1));

        return event;
    },

    on: function(type, cb) {
        this.$el.on(type + '.queryBuilder', cb);
        return this;
    },

    off: function(type, cb) {
        this.$el.off(type + '.queryBuilder', cb);
        return this;
    },

    once: function(type, cb) {
        this.$el.one(type + '.queryBuilder', cb);
        return this;
    }
});


// PLUGINS SYSTEM
// ===============================
QueryBuilder.plugins = {};

/**
 * Get or extend the default configuration
 * @param options {object,optional} new configuration, leave undefined to get the default config
 * @return {undefined|object} nothing or configuration object (copy)
 */
QueryBuilder.defaults = function(options) {
    if (typeof options == 'object') {
        $.extendext(true, 'replace', QueryBuilder.DEFAULTS, options);
    }
    else if (typeof options == 'string') {
        if (typeof QueryBuilder.DEFAULTS[options] == 'object') {
            return $.extend(true, {}, QueryBuilder.DEFAULTS[options]);
        }
        else {
            return QueryBuilder.DEFAULTS[options];
        }
    }
    else {
        return $.extend(true, {}, QueryBuilder.DEFAULTS);
    }
};

/**
 * Define a new plugin
 * @param {string}
 * @param {function}
 * @param {object,optional} default configuration
 */
QueryBuilder.define = function(name, fct, def) {
    QueryBuilder.plugins[name] = {
        fct: fct,
        def: def || {}
    };
};

/**
 * Add new methods
 * @param {object}
 */
QueryBuilder.extend = function(methods) {
    $.extend(QueryBuilder.prototype, methods);
};

/**
 * Init plugins for an instance
 */
QueryBuilder.prototype.initPlugins = function() {
    if (!this.plugins) {
        return;
    }

    if ($.isArray(this.plugins)) {
        var tmp = {};
        this.plugins.forEach(function(plugin) {
            tmp[plugin] = null;
        });
        this.plugins = tmp;
    }

    Object.keys(this.plugins).forEach(function(plugin) {
        if (plugin in QueryBuilder.plugins) {
            this.plugins[plugin] = $.extend(true, {},
                QueryBuilder.plugins[plugin].def,
                this.plugins[plugin] || {}
            );

            QueryBuilder.plugins[plugin].fct.call(this, this.plugins[plugin]);
        }
        else {
            error('Unable to find plugin "{0}"', plugin);
        }
    }, this);
};

QueryBuilder.types = {
    'string': 'string',
    'integer': 'number',
    'double': 'number',
    'date': 'datetime',
    'time': 'datetime',
    'datetime': 'datetime',
    'boolean': 'boolean'
};

QueryBuilder.inputs = [
    'text',
    'textarea',
    'radio',
    'checkbox',
    'select'
];

QueryBuilder.modifiable_options = [
    'display_errors',
    'allow_groups',
    'allow_empty'
];

QueryBuilder.DEFAULTS = {
    filters: [],
    plugins: [],

    display_errors: true,
    allow_groups: -1,
    allow_empty: false,
    conditions: ['AND', 'OR'],
    default_condition: 'AND',
    inputs_separator: ' , ',
    select_placeholder: '------',

    default_rule_flags: {
        filter_readonly: false,
        operator_readonly: false,
        value_readonly: false,
        no_delete: false
    },

    template: {
        group: null,
        rule: null
    },

    lang: {
        "add_rule": 'Add rule',
        "add_group": 'Add group',
        "delete_rule": '',
        "delete_group": '',

        "conditions": {
            "AND": "AND",
            "OR": "OR"
        },

        "operators": {
            "equal": "equal",
            "not_equal": "not equal",
            "in": "in",
            "not_in": "not in",
            "less": "less",
            "less_or_equal": "less or equal",
            "greater": "greater",
            "greater_or_equal": "greater or equal",
            "between": "between",
            "begins_with": "begins with",
            "not_begins_with": "doesn't begin with",
            "contains": "contains",
            "not_contains": "doesn't contain",
            "ends_with": "ends with",
            "not_ends_with": "doesn't end with",
            "is_empty": "is empty",
            "is_not_empty": "is not empty",
            "is_null": "is null",
            "is_not_null": "is not null",
            "greater_by_x_days" : '>= pred date -x days',
            "less_by_x_days" : '<= pred date -x days',
            "sub_query" : 'sub query',
            "like":'like',
            "not_like":'not like'
        },

        "errors": {
            "no_filter": "No filter selected",
            "empty_group": "The group is empty",
            "radio_empty": "No value selected",
            "checkbox_empty": "No value selected",
            "select_empty": "No value selected",
            "string_empty": "Empty value",
            "string_exceed_min_length": "Must contain at least {0} characters",
            "string_exceed_max_length": "Must not contain more than {0} characters",
            "string_invalid_format": "Invalid format ({0})",
            "number_nan": "Not a number",
            "number_not_integer": "Not an integer",
            "number_not_double": "Not a real number",
            "number_exceed_min": "Must be greater than {0}",
            "number_exceed_max": "Must be lower than {0}",
            "number_wrong_step": "Must be a multiple of {0}",
            "datetime_empty": "Empty value",
            "datetime_invalid": "Invalid date format ({0})",
            "datetime_exceed_min": "Must be after {0}",
            "datetime_exceed_max": "Must be before {0}",
            "boolean_not_valid": "Not a boolean",
            "operator_not_multiple": "Operator {0} cannot accept multiple values"
        }
    },

    operators: [
        {type: 'equal',            nb_inputs: 1, multiple: false, apply_to: ['string', 'number', 'datetime', 'boolean']},
        {type: 'not_equal',        nb_inputs: 1, multiple: false, apply_to: ['string', 'number', 'datetime', 'boolean']},
        //{type: 'sub_query',        nb_inputs: 1, multiple: false, apply_to: ['boolean']},
        {type: 'in',               nb_inputs: 1, multiple: true,  apply_to: ['string']},
        {type: 'not_in',           nb_inputs: 1, multiple: true,  apply_to: ['string']},
        {type: 'less',             nb_inputs: 1, multiple: false, apply_to: ['number', 'datetime']},
        {type: 'less_or_equal',    nb_inputs: 1, multiple: false, apply_to: ['number', 'datetime']},
        {type: 'greater',          nb_inputs: 1, multiple: false, apply_to: ['number', 'datetime']},
        {type: 'greater_or_equal', nb_inputs: 1, multiple: false, apply_to: ['number', 'datetime']},
        {type: 'between',          nb_inputs: 2, multiple: false, apply_to: ['number', 'datetime']},
        {type: 'begins_with',      nb_inputs: 1, multiple: false, apply_to: ['string']},
        {type: 'not_begins_with',  nb_inputs: 1, multiple: false, apply_to: ['string']},
        {type: 'ends_with',        nb_inputs: 1, multiple: false, apply_to: ['string']},
        {type: 'not_ends_with',    nb_inputs: 1, multiple: false, apply_to: ['string']},		
        {type: 'contains',         nb_inputs: 1, multiple: false, apply_to: ['string', 'boolean']},
        {type: 'not_contains',     nb_inputs: 1, multiple: false, apply_to: ['string', 'boolean']},
//        {type: 'is_empty',         nb_inputs: 0, multiple: false, apply_to: ['string']},
//        {type: 'is_not_empty',     nb_inputs: 0, multiple: false, apply_to: ['string']},
        {type: 'greater_by_x_days', nb_inputs: 1, multiple: false, apply_to: ['datetime']},
        {type: 'less_by_x_days', nb_inputs: 1, multiple: false, apply_to: ['datetime']},
        {type: 'is_null',          nb_inputs: 0, multiple: false, apply_to: ['string', 'number', 'datetime', 'boolean']},
        {type: 'is_not_null',      nb_inputs: 0, multiple: false, apply_to: ['string', 'number', 'datetime', 'boolean']},		
        {type: 'like',         nb_inputs: 1, multiple: false, apply_to: ['string']},
        {type: 'not_like',     nb_inputs: 1, multiple: false, apply_to: ['string']}
    ],

    icons: {
        add_group: 'glyphicon glyphicon-plus-sign',
        add_rule: 'glyphicon glyphicon-plus',
        remove_group: 'glyphicon glyphicon-remove',
        remove_rule: 'glyphicon glyphicon-remove',
        error: 'glyphicon glyphicon-warning-sign'
    }
};

/**
 * Init the builder
 */
QueryBuilder.prototype.init = function($el, options) {
    $el[0].queryBuilder = this;
    this.$el = $el;

    // PROPERTIES
    this.settings = $.extendext(true, 'replace', {}, QueryBuilder.DEFAULTS, options);
    this.model = new Model();
    this.status = {
        group_id: 0,
        rule_id: 0,
        generated_id: false,
        has_optgroup: false,
        id: null
    };

    // "allow_groups" can be boolean or int
    if (this.settings.allow_groups === false) {
        this.settings.allow_groups = 0;
    }
    else if (this.settings.allow_groups === true) {
        this.settings.allow_groups = -1;
    }

    // SETTINGS SHORTCUTS
    this.filters = this.settings.filters;
    this.lang = this.settings.lang;
    this.icons = this.settings.icons;
    this.operators = this.settings.operators;
    this.template = this.settings.template;
    this.plugins = this.settings.plugins;

    if (this.template.group === null) {
        this.template.group = this.getGroupTemplate;
    }
    if (this.template.rule === null) {
        this.template.rule = this.getRuleTemplate;
    }

    // ensure we have a container id
    if (!this.$el.attr('id')) {
        this.$el.attr('id', 'qb_'+Math.floor(Math.random()*99999));
        this.status.generated_id = true;
    }
    this.status.id = this.$el.attr('id');

    // INIT
    this.$el.addClass('query-builder form-inline');

    this.checkFilters();
    this.bindEvents();
    this.initPlugins();

    this.trigger('afterInit');

    if (options.rules) {
        this.setRules(options.rules);
        delete this.settings.rules;
    }
    else {
        this.setRoot(true);
    }
};

/**
 * Checks the configuration of each filter
 */
QueryBuilder.prototype.checkFilters = function() {
    var definedFilters = [],
        that = this;

    if (!this.filters || this.filters.length === 0) {
        error('Missing filters list');
    }

    this.filters.forEach(function(filter, i) {
        if (!filter.id) {
            error('Missing filter {0} id', i);
        }
        if (definedFilters.indexOf(filter.id) != -1) {
            error('Filter "{0}" already defined', filter.id);
        }
        definedFilters.push(filter.id);

        if (!filter.type) {
            filter.type = 'string';
        }
        else if (!QueryBuilder.types[filter.type]) {
            error('Invalid type "{0}"', filter.type);
        }

        if (!filter.input) {
            filter.input = 'text';
        }
        else if (typeof filter.input != 'function' && QueryBuilder.inputs.indexOf(filter.input) == -1) {
            error('Invalid input "{0}"', filter.input);
        }

        if (!filter.field) {
            filter.field = filter.id;
        }
        if (!filter.label) {
            filter.label = filter.field;
        }

        if (!filter.optgroup) {
            filter.optgroup = null;
        }
        else {
            that.status.has_optgroup = true;
        }

        switch (filter.input) {
            case 'radio': case 'checkbox':
                if (!filter.values || filter.values.length < 1) {
                    error('Missing filter "{0}" values', filter.id);
                }
                break;
        }
    });

    // group filters with same optgroup, preserving declaration order when possible
    if (this.status.has_optgroup) {
        var optgroups = [],
            filters = [];

        this.filters.forEach(function(filter, i) {
            var idx;

            if (filter.optgroup) {
                idx = optgroups.lastIndexOf(filter.optgroup);

                if (idx == -1) {
                    idx = optgroups.length;
                }
                else {
                    idx++;
                }
            }
            else {
                idx = optgroups.length;
            }

            optgroups.splice(idx, 0, filter.optgroup);
            filters.splice(idx, 0, filter);
        });

        this.filters = filters;
    }
};

/**
 * Add all events listeners
 */
QueryBuilder.prototype.bindEvents = function() {
    var that = this;

    // group condition change
    this.$el.on('change.queryBuilder', '.rules-group-header [name$=_cond]', function() {
        if ($(this).is(':checked')) {
            var $group = $(this).closest('.rules-group-container');
            Model($group).condition = $(this).val();
        }
    });

    // rule filter change
    this.$el.on('change.queryBuilder', '.rule-filter-container [name$=_filter]', function() {
        var $rule = $(this).closest('.rule-container');
        Model($rule).filter = that.getFilterById($(this).val());
    });

    // rule operator change
    this.$el.on('change.queryBuilder', '.rule-operator-container [name$=_operator]', function() {
        var $rule = $(this).closest('.rule-container');
        Model($rule).operator = that.getOperatorByType($(this).val());
    });

    // add rule button
    this.$el.on('click.queryBuilder', '[data-add=rule]', function() {
        var $group = $(this).closest('.rules-group-container');
        that.addRule(Model($group));
    });

    // delete rule button
    this.$el.on('click.queryBuilder', '[data-delete=rule]', function() {
        var $rule = $(this).closest('.rule-container');
        that.deleteRule(Model($rule));
    });

    if (this.settings.allow_groups !== 0) {
        // add group button
        this.$el.on('click.queryBuilder', '[data-add=group]', function() {
            var $group = $(this).closest('.rules-group-container');
            that.addGroup(Model($group));
        });

        // delete group button
        this.$el.on('click.queryBuilder', '[data-delete=group]', function() {
            var $group = $(this).closest('.rules-group-container');
            that.deleteGroup(Model($group));
        });
    }

    // model events
    this.model.on({
        'drop': function(e, node) {
            node.$el.remove();
        },
        'add': function(e, node, index) {
            node.$el.detach();

            if (index === 0) {
                node.$el.prependTo(node.parent.$el.find('>.rules-group-body>.rules-list'));
            }
            else {
                node.$el.insertAfter(node.parent.rules[index-1].$el);
            }
        },
        'update': function(e, node, field, value, oldValue) {
            switch (field) {
                case 'error':
                    that.displayError(node);
                    break;

                case 'condition':
                    that.updateGroupCondition(node);
                    break;

                case 'filter':
                    that.updateRuleFilter(node);
                    break;

                case 'operator':
                    that.updateRuleOperator(node, oldValue);
                    break;

                case 'flags':
                    that.applyRuleFlags(node);
                    break;
            }
        }
    });
};

/**
 * Create the root group
 * @param addRule {bool,optional} add a default empty rule
 * @return group {Root}
 */
QueryBuilder.prototype.setRoot = function(addRule) {
    addRule = (addRule === undefined || addRule === true);

    var group_id = this.nextGroupId(),
        $group = $(this.template.group.call(this, group_id, 1));

    this.$el.append($group);
    this.model.root = new Group(null, $group);
    this.model.root.model = this.model;
    this.model.root.condition = this.settings.default_condition;

    if (addRule) {
        this.addRule(this.model.root);
    }

    return this.model.root;
};

/**
 * Add a new group
 * @param parent {Group}
 * @param addRule {bool,optional} add a default empty rule
 * @return group {Group}
 */
QueryBuilder.prototype.addGroup = function(parent, addRule) {
    addRule = (addRule === undefined || addRule === true);

    var level = parent.level + 1;

    var e = this.trigger('beforeAddGroup', parent, addRule, level);
    if (e.isDefaultPrevented()) {
        return null;
    }

    var group_id = this.nextGroupId(),
        $group = $(this.template.group.call(this, group_id, level)),
        model = parent.addGroup($group);

    this.trigger('afterAddGroup', model);

    model.condition = this.settings.default_condition;

    if (addRule) {
        this.addRule(model);
    }

    return model;
};

/**
 * Tries to delete a group. The group is not deleted if at least one rule is no_delete.
 * @param group {Group}
 * @return {boolean} true if the group has been deleted
 */
QueryBuilder.prototype.deleteGroup = function(group) {
    if (group.isRoot()) {
        return false;
    }

    var e = this.trigger('beforeDeleteGroup', group);
    if (e.isDefaultPrevented()) {
        return false;
    }

    var del = true;

    group.each('reverse', function(rule) {
        del&= this.deleteRule(rule);
    }, function(group) {
        del&= this.deleteGroup(group);
    }, this);

    if (del) {
        group.drop();
        this.trigger('afterDeleteGroup');
    }

    return del;
};

/**
 * Changes the condition of a group
 * @param group {Group}
 */
QueryBuilder.prototype.updateGroupCondition = function(group) {
    group.$el.find('>.rules-group-header [name$=_cond]').each(function() {
        var $this = $(this);
        $this.prop('checked', $this.val() === group.condition);
        $this.parent().toggleClass('active', $this.val() === group.condition);
    });
};

/**
 * Add a new rule
 * @param parent {Group}
 * @return rule {Rule}
 */
QueryBuilder.prototype.addRule = function(parent) {
    var e = this.trigger('beforeAddRule', parent);
    if (e.isDefaultPrevented()) {
        return null;
    }

    var rule_id = this.nextRuleId(),
        $rule = $(this.template.rule.call(this, rule_id)),
        model = parent.addRule($rule);

    this.trigger('afterAddRule', model);

    this.createRuleFilters(model);

    return model;
};

/**
 * Delete a rule.
 * @param rule {Rule}
 * @return {boolean} true if the rule has been deleted
 */
QueryBuilder.prototype.deleteRule = function(rule) {
    if (rule.flags.no_delete) {
        return false;
    }

    var e = this.trigger('beforeDeleteRule', rule);
    if (e.isDefaultPrevented()) {
        return false;
    }

    rule.drop();

    this.trigger('afterDeleteRule');

    return true;
};

/**
 * Create the filters <select> for a rule
 * @param rule {Rule}
 */
QueryBuilder.prototype.createRuleFilters = function(rule) {
    var filters = this.change('getRuleFilters', this.filters, rule);

    var $filterSelect = $(this.getRuleFilterSelect(rule, filters));

    rule.$el.find('.rule-filter-container').append($filterSelect);

    this.trigger('afterCreateRuleFilters', rule);
};

/**
 * Create the operators <select> for a rule and init the rule operator
 * @param rule {Rule}
 */
QueryBuilder.prototype.createRuleOperators = function(rule, triggerChangeOperator) {
    var $operatorContainer = rule.$el.find('.rule-operator-container').empty();

    if (!rule.filter) {
        return;
    }

    var operators = this.getOperators(rule.filter),
        $operatorSelect = $(this.getRuleOperatorSelect(rule, operators));

    $operatorContainer.html($operatorSelect);

    if (triggerChangeOperator !== false) {
        rule.operator = operators[0];
    }
    else {
        rule.__.operator = operators[0];
    }

    this.trigger('afterCreateRuleOperators', rule, operators);
};

/**
 * Create the main input for a rule
 * @param rule {Rule}
 */
QueryBuilder.prototype.createRuleInput = function(rule) {
    var $valueContainer = rule.$el.find('.rule-value-container').empty();

    if (!rule.filter || rule.operator.nb_inputs === 0) {
        return;
    }

    var $inputs = $(),
        filter = rule.filter;

    for (var i=0; i<rule.operator.nb_inputs; i++) {
        var $ruleInput = $(this.getRuleInput(rule, i));
        if (i > 0) $valueContainer.append(this.settings.inputs_separator);
        $valueContainer.append($ruleInput);
        $inputs = $inputs.add($ruleInput);
    }

    $valueContainer.show();

    if (filter.plugin) {
        $inputs[filter.plugin](filter.plugin_config || {});
    }

    this.trigger('afterCreateRuleInput', rule);

    if (filter.default_value !== undefined) {
        this.setRuleValue(rule, filter.default_value);
    }
};

/**
 * Perform action when rule's filter is changed
 * @param rule {Rule}
 */
QueryBuilder.prototype.updateRuleFilter = function(rule) {
    this.createRuleOperators(rule, false);
    this.createRuleInput(rule);

    rule.$el.find('.rule-filter-container [name$=_filter]').val(rule.filter ? rule.filter.id : '-1');

    this.trigger('afterUpdateRuleFilter', rule);
};

/**
 * Update main <input> visibility when rule operator changes
 * @param rule {Rule}
 * @param previousOperator {object}
 */
QueryBuilder.prototype.updateRuleOperator = function(rule, previousOperator) {
    var $valueContainer = rule.$el.find('.rule-value-container');

    if (!rule.operator || rule.operator.nb_inputs === 0) {
        $valueContainer.hide();
    }
    else {
        $valueContainer.show();

        if ($valueContainer.is(':empty') || rule.operator.nb_inputs !== previousOperator.nb_inputs) {
            this.createRuleInput(rule);
        }
    }

    if (rule.operator) {
        rule.$el.find('.rule-operator-container [name$=_operator]').val(rule.operator.type);
    }

    this.trigger('afterUpdateRuleOperator', rule);
};

/**
 * Change rules properties depending on flags.
 * @param rule {Rule}
 * @param readonly {boolean}
 */
QueryBuilder.prototype.applyRuleFlags = function(rule, readonly) {
    var flags = rule.flags;

    if (flags.filter_readonly) {
        rule.$el.find('[name$=_filter]').prop('disabled', true);
    }
    if (flags.operator_readonly) {
        rule.$el.find('[name$=_operator]').prop('disabled', true);
    }
    if (flags.value_readonly) {
        rule.$el.find('[name*=_value_]').prop('disabled', true);
    }
    if (flags.no_delete) {
        rule.$el.find('[data-delete=rule]').remove();
    }

    this.trigger('afterApplyRuleFlags', rule);
};

/**
 * Clear all errors markers
 * @param node {Node,optional} default is root Group
 */
QueryBuilder.prototype.clearErrors = function(node) {
    node = node || this.model.root;

    if (!node) {
        return;
    }

    node.error = null;

    if (node instanceof Group) {
        node.each(function(rule) {
            rule.error = null;
        }, function(group) {
            this.clearErrors(group);
        }, this);
    }
};

/**
 * Add/Remove class .has-error and update error title
 * @param node {Node}
 */
QueryBuilder.prototype.displayError = function(node) {
    if (this.settings.display_errors) {
        if (node.error === null) {
            node.$el.removeClass('has-error');
        }
        else {
            // translate the text without modifying event array
            var error = $.extend([], node.error, [
                this.lang.errors[node.error[0]] || node.error[0]
            ]);

            node.$el.addClass('has-error')
              .find('.error-container').eq(0).attr('title', fmt.apply(null, error));
        }
    }
};

/**
 * Trigger a validation error event
 * @param node {Node}
 * @param error {array}
 * @param value {mixed}
 */
QueryBuilder.prototype.triggerValidationError = function(node, error, value) {
    if (!$.isArray(error)) {
        error = [error];
    }

    var e = this.trigger('validationError', node, error, value);
    if (!e.isDefaultPrevented()) {
        node.error = error;
    }
};

/**
 * Destroy the plugin
 */
QueryBuilder.prototype.destroy = function() {
    this.trigger('beforeDestroy');

    if (this.status.generated_id) {
        this.$el.removeAttr('id');
    }

    this.clear();
    this.model = null;

    this.$el
        .off('.queryBuilder')
        .removeClass('query-builder')
        .removeData('queryBuilder');

    delete this.$el[0].queryBuilder;
};

/**
 * Reset the plugin
 */
QueryBuilder.prototype.reset = function() {
    this.status.group_id = 1;
    this.status.rule_id = 0;

    this.model.root.empty();

    this.addRule(this.model.root);

    this.trigger('afterReset');
};

/**
 * Clear the plugin
 */
QueryBuilder.prototype.clear = function() {
    this.status.group_id = 0;
    this.status.rule_id = 0;

    if (this.model.root) {
        this.model.root.drop();
        this.model.root = null;
    }

    this.trigger('afterClear');
};

/**
 * Modify the builder configuration
 * Only options defined in QueryBuilder.modifiable_options are modifiable
 * @param {object}
 */
QueryBuilder.prototype.setOptions = function(options) {
    // use jQuery utils to filter options keys
    $.makeArray($(Object.keys(options)).filter(QueryBuilder.modifiable_options))
        .forEach(function(opt) {
            this.settings[opt] = options[opt];
        }, this);
};

/**
 * Validate the whole builder
 * @return {boolean}
 */
QueryBuilder.prototype.validate = function() {
    this.clearErrors();

    var that = this;

    var valid = (function parse(group) {
        var done = 0, errors = 0;

        group.each(function(rule) {
            if (!rule.filter) {
                that.triggerValidationError(rule, 'no_filter', null);
                errors++;
                return;
            }

            if (rule.operator.nb_inputs !== 0) {
                var value = that.getRuleValue(rule),
                    valid = that.validateValue(rule, value);

                if (valid !== true) {
                    that.triggerValidationError(rule, valid, value);
                    errors++;
                    return;
                }
            }

            done++;

        }, function(group) {
            if (parse(group)) {
                done++;
            }
            else {
                errors++;
            }
        });

        if (errors > 0) {
            return false;
        }
        else if (done === 0 && (!that.settings.allow_empty || !group.isRoot())) {
            that.triggerValidationError(group, 'empty_group', null);
            return false;
        }

        return true;

    }(this.model.root));

    return this.change('validate', valid);
};

/**
 * Get an object representing current rules
 * @return {object}
 */
QueryBuilder.prototype.getRules = function() {
    if (!this.validate()) {
        return {};
    }

    var that = this;

    var data = (function parse(group) {
        var out = {
            condition: group.condition,
            rules: []
        };

        group.each(function(model) {
            var value = null;
            if (model.operator.nb_inputs !== 0) {
                value = that.getRuleValue(model);
            }

            var rule = {
                id: model.filter.id,
                field: model.filter.field,
                type: model.filter.type,
                input: model.filter.input,
                operator: model.operator.type,
                value: value
            };

            if (model.filter.data || model.data) {
                rule.data = $.extendext(true, 'replace', {}, model.filter.data, model.data);
            }

            out.rules.push(rule);

        }, function(model) {
            out.rules.push(parse(model));
        });

        return out;

    }(this.model.root));

    return this.change('getRules', data);
};

/**
 * Set rules from object
 * @param data {object}
 */
QueryBuilder.prototype.setRules = function(data) {
    this.clear();
    this.setRoot(false);

    if (!data || !data.rules || (data.rules.length===0 && !this.settings.allow_empty)) {
        error('Incorrect data object passed');
    }

    data = this.change('setRules', data);

    var that = this;

    (function add(data, group){
        if (group === null) {
            return;
        }

        if (data.condition === undefined) {
            data.condition = that.settings.default_condition;
        }
        else if (that.settings.conditions.indexOf(data.condition) == -1) {
            error('Invalid condition "{0}"', data.condition);
        }

        group.condition = data.condition.toUpperCase();

        data.rules.forEach(function(rule) {
            var model;
            if (rule.rules && rule.rules.length>0) {
                if (that.settings.allow_groups != -1 && that.settings.allow_groups < group.level) {
                    that.reset();
                    error('No more than {0} groups are allowed', that.settings.allow_groups);
                }
                else {
                    model = that.addGroup(group, false);
                    add(rule, model);
                }
            }
            else {
                if (rule.id === undefined) {
                    error('Missing rule field id');
                }
                if (rule.operator === undefined) {
                    rule.operator = 'equal';
                }

                model = that.addRule(group);
                if (model === null) {
                    return;
                }

                model.filter = that.getFilterById(rule.id);
                model.operator = that.getOperatorByType(rule.operator);
                model.flags = that.parseRuleFlags(rule);

                if (rule.data) {
                    model.data = rule.data;
                }

                if (model.operator.nb_inputs !== 0 && rule.value !== undefined) {
                    that.setRuleValue(model, rule.value);
                }
            }
        });

    }(data, this.model.root));
};

/**
 * Check if a value is correct for a filter
 * @param rule {Rule}
 * @param value {string|string[]|undefined}
 * @return {array|true}
 */
QueryBuilder.prototype.validateValue = function(rule, value) {
    var validation = rule.filter.validation || {},
        result = true;

    if (validation.callback) {
        result = validation.callback.call(this, value, rule);
    }
    else {
        result = this.validateValueInternal(rule, value);
    }

    return this.change('validateValue', result, value, rule);
};

/**
 * Default validation function
 * @param rule {Rule}
 * @param value {string|string[]|undefined}
 * @return {array|true}
 */
QueryBuilder.prototype.validateValueInternal = function(rule, value) {
    var filter = rule.filter,
        operator = rule.operator,
        validation = filter.validation || {},
        result = true,
        tmp;

    if (rule.operator.nb_inputs === 1) {
        value = [value];
    }
    else {
        value = value;
    }

    for (var i=0; i<operator.nb_inputs; i++) {

        switch (filter.input) {
            case 'radio':
                if (value[i] === undefined) {
                    result = ['radio_empty'];
                    break;
                }
                break;

            case 'checkbox':
                if (value[i].length === 0) {
                    result = ['checkbox_empty'];
                    break;
                }
                else if (!operator.multiple && value[i].length > 1) {
                    result = ['operator_not_multiple', this.lang[operator.type] || operator.type];
                    break;
                }
                break;

            case 'select':
                if (filter.multiple) {
                    if (value[i].length === 0) {
                        result = ['select_empty'];
                        break;
                    }
                    else if (!operator.multiple && value[i].length > 1) {
                        result = ['operator_not_multiple', this.lang[operator.type] || operator.type];
                        break;
                    }
                }
                else {
                    if (value[i] === undefined) {
                        result = ['select_empty'];
                        break;
                    }
                }
                break;

            default:
                switch (QueryBuilder.types[filter.type]) {
                    case 'string':
                        if (value[i].length === 0) {
                            result = ['string_empty'];
                            break;
                        }
                        if (validation.min !== undefined) {
                            if (value[i].length < parseInt(validation.min)) {
                                result = ['string_exceed_min_length', validation.min];
                                break;
                            }
                        }
                        if (validation.max !== undefined) {
                            if (value[i].length > parseInt(validation.max)) {
                                result = ['string_exceed_max_length', validation.max];
                                break;
                            }
                        }
                        if (validation.format) {
                            if (typeof validation.format === 'string') {
                                validation.format = new RegExp(validation.format);
                            }
                            if (!validation.format.test(value[i])) {
                                result = ['string_invalid_format', validation.format];
                                break;
                            }
                        }
                        break;

                    case 'number':
                        if (isNaN(value[i])) {
                            result = ['number_nan'];
                            break;
                        }
                        if (filter.type == 'integer') {
                            if (parseInt(value[i]) != value[i]) {
                                result = ['number_not_integer'];
                                break;
                            }
                        }
                        else {
                            if (parseFloat(value[i]) != value[i]) {
                                result = ['number_not_double'];
                                break;
                            }
                        }
                        if (validation.min !== undefined) {
                            if (value[i] < parseFloat(validation.min)) {
                                result = ['number_exceed_min', validation.min];
                                break;
                            }
                        }
                        if (validation.max !== undefined) {
                            if (value[i] > parseFloat(validation.max)) {
                                result = ['number_exceed_max', validation.max];
                                break;
                            }
                        }
                        if (validation.step !== undefined) {
                            var v = value[i]/validation.step;
                            if (parseInt(v) != v) {
                                result = ['number_wrong_step', validation.step];
                                break;
                            }
                        }
                        break;

                    case 'datetime':
                        if (value[i].length === 0) {
                            result = ['datetime_empty'];
                            break;
                        }

                        // we need MomentJS
                        if (validation.format) {
                            if (!('moment' in window)) {
                                error('MomentJS is required for Date/Time validation');
                            }

                            var datetime = moment(value[i], validation.format);
                            if (!datetime.isValid()) {
                                result = ['datetime_invalid'];
                                break;
                            }
                            else {
                                if (validation.min) {
                                    if (datetime < moment(validation.min, validation.format)) {
                                        result = ['datetime_exceed_min', validation.min];
                                        break;
                                    }
                                }
                                if (validation.max) {
                                    if (datetime > moment(validation.max, validation.format)) {
                                        result = ['datetime_exceed_max', validation.max];
                                        break;
                                    }
                                }
                            }
                        }
                        break;

                    case 'boolean':
                        tmp = value[i].trim().toLowerCase();
                        if (tmp !== 'true' && tmp !== 'false' && tmp !== '1' && tmp !== '0' && value[i] !== 1 && value[i] !== 0) {
                            result = ['boolean_not_valid'];
                            break;
                        }
                }
        }

        if (result !== true) {
            break;
        }
    }

    return result;
};

/**
 * Returns an incremented group ID
 * @return {string}
 */
QueryBuilder.prototype.nextGroupId = function() {
    return this.status.id + '_group_' + (this.status.group_id++);
};

/**
 * Returns an incremented rule ID
 * @return {string}
 */
QueryBuilder.prototype.nextRuleId = function() {
    return this.status.id + '_rule_' + (this.status.rule_id++);
};

/**
 * Returns the operators for a filter
 * @param filter {string|object} (filter id name or filter object)
 * @return {object[]}
 */
QueryBuilder.prototype.getOperators = function(filter) {
    if (typeof filter === 'string') {
        filter = this.getFilterById(filter);
    }

    var result = [];

    for (var i=0, l=this.operators.length; i<l; i++) {
        // filter operators check
        if (filter.operators) {
            if (filter.operators.indexOf(this.operators[i].type) == -1) {
                continue;
            }
        }
        // type check
        else if (this.operators[i].apply_to.indexOf(QueryBuilder.types[filter.type]) == -1) {
            continue;
        }

        result.push(this.operators[i]);
    }

    // keep sort order defined for the filter
    if (filter.operators) {
        result.sort(function(a, b) {
            return filter.operators.indexOf(a.type) - filter.operators.indexOf(b.type);
        });
    }

    return this.change('getOperators', result, filter);
};

/**
 * Returns a particular filter by its id
 * @param filterId {string}
 * @return {object|null}
 */
QueryBuilder.prototype.getFilterById = function(id) {
    if (id == '-1') {
        return null;
    }

    for (var i=0, l=this.filters.length; i<l; i++) {
        if (this.filters[i].id == id) {
            return this.filters[i];
        }
    }

    error('Undefined filter "{0}"', id);
};

/**
 * Return a particular operator by its type
 * @param type {string}
 * @return {object|null}
 */
QueryBuilder.prototype.getOperatorByType = function(type) {
    if (type == '-1') {
        return null;
    }

    for (var i=0, l=this.operators.length; i<l; i++) {
        if (this.operators[i].type == type) {
            return this.operators[i];
        }
    }

    error('Undefined operator  "{0}"', type);
};

/**
 * Returns rule value
 * @param rule {Rule}
 * @return {mixed}
 */
QueryBuilder.prototype.getRuleValue = function(rule) {
    var filter = rule.filter,
        operator = rule.operator,
        $value = rule.$el.find('.rule-value-container'),
        value = [], tmp;

    for (var i=0; i<operator.nb_inputs; i++) {
        var name = rule.id + '_value_' + i;

        switch (filter.input) {
            case 'radio':
                value.push($value.find('[name='+ name +']:checked').val());
                break;

            case 'checkbox':
                tmp = [];
                $value.find('[name='+ name +']:checked').each(function() {
                    tmp.push($(this).val());
                });
                value.push(tmp);
                break;

            case 'select':
                if (filter.multiple) {
                    tmp = [];
                    $value.find('[name='+ name +'] option:selected').each(function() {
                        tmp.push($(this).val());
                    });
                    value.push(tmp);
                }
                else {
                    value.push($value.find('[name='+ name +'] option:selected').val());
                }
                break;

            default:
                value.push($value.find('[name='+ name +']').val());
        }
    }

    if (operator.nb_inputs === 1) {
        value = value[0];
    }

    if (filter.valueParser) {
        value = filter.valueParser.call(this, rule, value);
    }

    return this.change('getRuleValue', value, rule);
};

/**
 * Sets the value of a rule.
 * @param rule {Rule}
 * @param value {mixed}
 */
QueryBuilder.prototype.setRuleValue = function(rule, value) {
    var filter = rule.filter,
        operator = rule.operator;

    this.trigger('beforeSetRuleValue', rule, value);

    if (filter.valueSetter) {
        filter.valueSetter.call(this, rule, value);
    }
    else {
        var $value = rule.$el.find('.rule-value-container');

        if (operator.nb_inputs == 1) {
            value = [value];
        }
        else {
            value = value;
        }

        for (var i=0; i<operator.nb_inputs; i++) {
            var name = rule.id +'_value_'+ i;

            switch (filter.input) {
                case 'radio':
                    $value.find('[name='+ name +'][value="'+ value[i] +'"]').prop('checked', true).trigger('change');
                    break;

                case 'checkbox':
                    if (!$.isArray(value[i])) {
                        value[i] = [value[i]];
                    }
                    value[i].forEach(function(value) {
                        $value.find('[name='+ name +'][value="'+ value +'"]').prop('checked', true).trigger('change');
                    });
                    break;

                default:
                    $value.find('[name='+ name +']').val(value[i]).trigger('change');
                    break;
            }
        }
    }

    this.trigger('afterSetRuleValue', rule, value);
};

/**
 * Clean rule flags.
 * @param rule {object}
 * @return {object}
 */
QueryBuilder.prototype.parseRuleFlags = function(rule) {
    var flags = $.extend({}, this.settings.default_rule_flags);

    if (rule.readonly) {
        $.extend(flags, {
            filter_readonly: true,
            operator_readonly: true,
            value_readonly: true,
            no_delete: true
        });
    }

    if (rule.flags) {
       $.extend(flags, rule.flags);
    }

    return this.change('parseRuleFlags', flags, rule);
};

/**
 * Returns group HTML
 * @param group_id {string}
 * @param level {int}
 * @return {string}
 */
QueryBuilder.prototype.getGroupTemplate = function(group_id, level) {
    var h = '\
<dl id="'+ group_id +'" class="rules-group-container"> \
  <dt class="rules-group-header"> \
    <div class="btn-group pull-right group-actions"> \
      <button type="button" class="btn btn-xs btn-success" data-add="rule"> \
        <i class="' + this.icons.add_rule + '"></i> '+ this.lang.add_rule +' \
      </button> \
      '+ (this.settings.allow_groups===-1 || this.settings.allow_groups>=level ?
        '<button type="button" class="btn btn-xs btn-success" data-add="group"> \
          <i class="' + this.icons.add_group + '"></i> '+ this.lang.add_group +' \
        </button>'
      :'') +' \
      '+ (level>1 ?
        '<button type="button" class="btn btn-xs btn-danger" data-delete="group"> \
          <i class="' + this.icons.remove_group + '"></i> '+ this.lang.delete_group +' \
        </button>'
      : '') +' \
    </div> \
    <div class="btn-group group-conditions"> \
      '+ this.getGroupConditions(group_id, level) +' \
    </div> \
    '+ (this.settings.display_errors ?
      '<div class="error-container"><i class="' + this.icons.error + '"></i></div>'
    :'') +'\
  </dt> \
  <dd class=rules-group-body> \
    <ul class=rules-list></ul> \
  </dd> \
</dl>';

    return this.change('getGroupTemplate', h, level);
};

/**
 * Returns group conditions HTML
 * @param group_id {string}
 * @param level {int}
 * @return {string}
 */
QueryBuilder.prototype.getGroupConditions = function(group_id, level) {
    var h = '';

    for (var i=0, l=this.settings.conditions.length; i<l; i++) {
        var cond = this.settings.conditions[i],
            label = this.lang.conditions[cond] || cond;

        h+= '\
        <label class="btn btn-xs btn-primary"> \
          <input type="radio" name="'+ group_id +'_cond" value="'+ cond +'"> '+ label +' \
        </label>';
    }

    return this.change('getGroupConditions', h, level);
};

/**
 * Returns rule HTML
 * @param rule_id {string}
 * @return {string}
 */
QueryBuilder.prototype.getRuleTemplate = function(rule_id) {
    var h = '\
<li id="'+ rule_id +'" class="rule-container"> \
  <div class="rule-header"> \
  <div class="btn-group pull-right rule-actions"> \
    <button type="button" class="btn btn-xs btn-danger" data-delete="rule"> \
      <i class="' + this.icons.remove_rule + '"></i> '+ this.lang.delete_rule +' \
    </button> \
  </div> \
  </div> \
  '+ (this.settings.display_errors ?
    '<div class="error-container"><i class="' + this.icons.error + '"></i></div>'
  :'') +'\
  <div class="rule-filter-container"></div> \
  <div class="rule-operator-container"></div> \
  <div class="rule-value-container"></div> \
</li>';

    return this.change('getRuleTemplate', h);
};

/**
 * Returns rule filter <select> HTML
 * @param rule {Rule}
 * @param filters {array}
 * @return {string}
 */
QueryBuilder.prototype.getRuleFilterSelect = function(rule, filters) {
    var optgroup = null;

    var h = '<select class="form-control" name="'+ rule.id +'_filter">';
    h+= '<option value="-1">'+ this.settings.select_placeholder +'</option>';

    filters.forEach(function(filter) {
        if (optgroup != filter.optgroup) {
            if (optgroup !== null) h+= '</optgroup>';
            optgroup = filter.optgroup;
            if (optgroup !== null) h+= '<optgroup label="'+ optgroup +'">';
        }

        h+= '<option value="'+ filter.id +'">'+ filter.label +'</option>';
    });

    if (optgroup !== null) h+= '</optgroup>';
    h+= '</select>';

    return this.change('getRuleFilterSelect', h, rule);
};

/**
 * Returns rule operator <select> HTML
 * @param rule {Rule}
 * @param operators {object}
 * @return {string}
 */
QueryBuilder.prototype.getRuleOperatorSelect = function(rule, operators) {
    var h = '<select class="form-control" name="'+ rule.id +'_operator">';

    for (var i=0, l=operators.length; i<l; i++) {
        var label = this.lang.operators[operators[i].type] || operators[i].type;
        h+= '<option value="'+ operators[i].type +'">'+ label +'</option>';
    }

    h+= '</select>';

    return this.change('getRuleOperatorSelect', h, rule);
};

/**
 * Return the rule value HTML
 * @param rule {Rule}
 * @param filter {object}
 * @param value_id {int}
 * @return {string}
 */
QueryBuilder.prototype.getRuleInput = function(rule, value_id) {
    var filter = rule.filter,
        validation = rule.filter.validation || {},
        name = rule.id +'_value_'+ value_id,
        c = filter.vertical ? ' class=block' : '',
        h = '';

    if (typeof filter.input === 'function') {
        h = filter.input.call(this, rule, name);
    }
    else {
        switch (filter.input) {
            case 'radio':
                iterateOptions(filter.values, function(key, val) {
                    h+= '<label'+ c +'><input type="radio" name="'+ name +'" value="'+ key +'"> '+ val +'</label> ';
                });
                break;

            case 'checkbox':
                iterateOptions(filter.values, function(key, val) {
                    h+= '<label'+ c +'><input type="checkbox" name="'+ name +'" value="'+ key +'"> '+ val +'</label> ';
                });
                break;

            case 'select':
                h+= '<select class="form-control" name="'+ name +'"'+ (filter.multiple ? ' multiple' : '') +'>';
                iterateOptions(filter.values, function(key, val) {
                    h+= '<option value="'+ key +'"> '+ val +'</option> ';
                });
                h+= '</select>';
                break;

            case 'textarea':
                h+= '<textarea class="form-control" name="'+ name +'"';
                if (filter.size) h+= ' cols="'+ filter.size +'"';
                if (filter.rows) h+= ' rows="'+ filter.rows +'"';
                if (validation.min !== undefined) h+= ' minlength="'+ validation.min +'"';
                if (validation.max !== undefined) h+= ' maxlength="'+ validation.max +'"';
                if (filter.placeholder) h+= ' placeholder="'+ filter.placeholder +'"';
                h+= '></textarea>';
                break;

            default:
                switch (QueryBuilder.types[filter.type]) {
                    case 'number':
                        h+= '<input class="form-control" type="number" name="'+ name +'"';
                        if (validation.step !== undefined) h+= ' step="'+ validation.step +'"';
                        if (validation.min !== undefined) h+= ' min="'+ validation.min +'"';
                        if (validation.max !== undefined) h+= ' max="'+ validation.max +'"';
                        if (filter.placeholder) h+= ' placeholder="'+ filter.placeholder +'"';
                        if (filter.size) h+= ' size="'+ filter.size +'"';
                        h+= '>';
                        break;

                    default:
                        h+= '<input class="form-control" type="text" name="'+ name +'"';
                        if (filter.placeholder) h+= ' placeholder="'+ filter.placeholder +'"';
                        if (filter.type === 'string' && validation.min !== undefined) h+= ' minlength="'+ validation.min +'"';
                        if (filter.type === 'string' && validation.max !== undefined) h+= ' maxlength="'+ validation.max +'"';
                        if (filter.size) h+= ' size="'+ filter.size +'"';
                        h+= '>';
                }
        }
    }

    return this.change('getRuleInput', h, rule, name);
};

// Model CLASS
// ===============================
/**
 * Main object storing data model and emitting events
 * ---------
 * Access Node object stored in jQuery objects
 * @param el {jQuery|Node}
 * @return {Node}
 */
function Model(el) {
    if (!(this instanceof Model)) {
        return Model.getModel(el);
    }

    this.root = null;
    this.$ = $(this);
}

$.extend(Model.prototype, {
    trigger: function(type) {
        this.$.triggerHandler(type, aps.call(arguments, 1));
        return this;
    },

    on: function() {
        this.$.on.apply(this.$, aps.call(arguments));
        return this;
    },

    off: function() {
        this.$.off.apply(this.$, aps.call(arguments));
        return this;
    },

    once: function() {
        this.$.one.apply(this.$, aps.call(arguments));
        return this;
    }
});

/**
 * Access Node object stored in jQuery objects
 * @param el {jQuery|Node}
 * @return {Node}
 */
Model.getModel = function(el) {
    if (!el) {
        return null;
    }
    else if (el instanceof Node) {
        return el;
    }
    else {
        return $(el).data('queryBuilderModel');
    }
};

/*
 * Define Node properties with getter and setter
 * Update events are emitted in the setter through root Model (if any)
 */
function defineModelProperties(obj, fields) {
    fields.forEach(function(field) {
        Object.defineProperty(obj.prototype, field, {
            enumerable: true,
            get: function() {
                return this.__[field];
            },
            set: function(value) {
                var oldValue = (this.__[field] !== null && typeof this.__[field] == 'object') ?
                  $.extend({}, this.__[field]) :
                  this.__[field];

                this.__[field] = value;

                if (this.model !== null) {
                    this.model.trigger('update', this, field, value, oldValue);
                }
            }
        });
    });
}


// Node abstract CLASS
// ===============================
/**
 * @param {Node}
 * @param {jQuery}
 */
var Node = function(parent, $el) {
    if (!(this instanceof Node)) {
        return new Node();
    }

    Object.defineProperty(this, '__', { value: {}});

    $el.data('queryBuilderModel', this);

    this.model = parent === null ? null : parent.model;
    this.parent = parent;
    // this.level -- initialized in 'parent' setter
    this.$el = $el;
    this.id = $el[0].id;
    this.error = null;
    this.data = undefined;
};

defineModelProperties(Node, ['level', 'error', 'data']);

Object.defineProperty(Node.prototype, 'parent', {
    enumerable: true,
    get: function() {
        return this.__.parent;
    },
    set: function(value) {
        this.__.parent = value;
        this.level = this.parent === null ? 1 : this.parent.level+1;
    }
});

/**
 * Check if this Node is the root
 * @return {boolean}
 */
Node.prototype.isRoot = function() {
    return (this.level === 1);
};

/**
 * Return node position inside parent
 * @return {int}
 */
Node.prototype.getPos = function() {
    if (this.isRoot()) {
        return -1;
    }
    else {
        return this.parent.getNodePos(this);
    }
};

/**
 * Delete self
 */
Node.prototype.drop = function() {
    if (this.model !== null) {
        this.model.trigger('drop', this);
    }

    if (!this.isRoot()) {
        this.parent._dropNode(this);
        this.parent = null;
    }
};

/**
 * Move itself after another Node
 * @param {Node}
 * @return {Node} self
 */
Node.prototype.moveAfter = function(node) {
    if (this.isRoot()) return;

    this.parent._dropNode(this);
    node.parent._addNode(this, node.getPos()+1);
    return this;
};

/**
 * Move itself at the beginning of parent or another Group
 * @param {Group,optional}
 * @return {Node} self
 */
Node.prototype.moveAtBegin = function(target) {
    if (this.isRoot()) return;

    if (target === undefined) {
        target = this.parent;
    }

    this.parent._dropNode(this);
    target._addNode(this, 0);
    return this;
};

/**
 * Move itself at the end of parent or another Group
 * @param {Group,optional}
 * @return {Node} self
 */
Node.prototype.moveAtEnd = function(target) {
    if (this.isRoot()) return;

    if (target === undefined) {
        target = this.parent;
    }

    this.parent._dropNode(this);
    target._addNode(this, target.length());
    return this;
};


// GROUP CLASS
// ===============================
/**
 * @param {Group}
 * @param {jQuery}
 */
var Group = function(parent, $el) {
    if (!(this instanceof Group)) {
        return new Group(parent, $el);
    }

    Node.call(this, parent, $el);

    this.condition = null;
    this.rules = [];
};

Group.prototype = Object.create(Node.prototype);
Group.prototype.constructor = Group;

defineModelProperties(Group, ['condition']);

/**
 * Empty the Group
 */
Group.prototype.empty = function() {
    this.each('reverse', function(rule) {
        rule.drop();
    }, function(group) {
        group.drop();
    });
};

/**
 * Delete self
 */
Group.prototype.drop = function() {
    this.empty();
    Node.prototype.drop.call(this);
};

/**
 * Return the number of children
 * @return {int}
 */
Group.prototype.length = function() {
    return this.rules.length;
};

/**
 * Add a Node at specified index
 * @param {Node}
 * @param {int,optional}
 * @return {Node} the inserted node
 */
Group.prototype._addNode = function(node, index) {
    if (index === undefined) {
        index = this.length();
    }

    this.rules.splice(index, 0, node);
    node.parent = this;

    if (this.model !== null) {
        this.model.trigger('add', node, index);
    }

    return node;
};

/**
 * Add a Group by jQuery element at specified index
 * @param {jQuery}
 * @param {int,optional}
 * @return {Group} the inserted group
 */
Group.prototype.addGroup = function($el, index) {
    return this._addNode(new Group(this, $el), index);
};

/**
 * Add a Rule by jQuery element at specified index
 * @param {jQuery}
 * @param {int,optional}
 * @return {Rule} the inserted rule
 */
Group.prototype.addRule = function($el, index) {
    return this._addNode(new Rule(this, $el), index);
};

/**
 * Delete a specific Node
 * @param {Node}
 * @return {Group} self
 */
Group.prototype._dropNode = function(node) {
    var index = this.getNodePos(node);
    if (index !== -1) {
        node.parent = null;
        this.rules.splice(index, 1);
    }

    return this;
};

/**
 * Return position of a child Node
 * @param {Node}
 * @return {int}
 */
Group.prototype.getNodePos = function(node) {
    return this.rules.indexOf(node);
};

/**
 * Iterate over all Nodes
 * @param {boolean,optional} iterate in reverse order, required if you delete nodes
 * @param {function} callback for Rules
 * @param {function,optional} callback for Groups
 * @return {boolean}
 */
Group.prototype.each = function(reverse, cbRule, cbGroup, context) {
    if (typeof reverse === 'function') {
        context = cbGroup;
        cbGroup = cbRule;
        cbRule = reverse;
        reverse = false;
    }
    context = context === undefined ? null : context;

    var i = reverse ? this.rules.length-1 : 0,
        l = reverse ? 0 : this.rules.length-1,
        c = reverse ? -1 : 1,
        next = function(){ return reverse ? i>=l : i<=l; },
        stop = false;

    for (; next(); i+=c) {
        if (this.rules[i] instanceof Group) {
            if (cbGroup !== undefined) {
                stop = cbGroup.call(context, this.rules[i]) === false;
            }
        }
        else {
            stop = cbRule.call(context, this.rules[i]) === false;
        }

        if (stop) {
            break;
        }
    }

    return !stop;
};

/**
 * Return true if the group contains a particular Node
 * @param {Node}
 * @param {boolean,optional} recursive search
 * @return {boolean}
 */
Group.prototype.contains = function(node, deep) {
    if (this.getNodePos(node) !== -1) {
        return true;
    }
    else if (!deep) {
        return false;
    }
    else {
        // the loop will return with false as soon as the Node is found
        return !this.each(function(rule) {
            return true;
        }, function(group) {
            return !group.contains(node, true);
        });
    }
};


// RULE CLASS
// ===============================
/**
 * @param {Group}
 * @param {jQuery}
 */
var Rule = function(parent, $el) {
    if (!(this instanceof Rule)) {
        return new Rule(parent, $el);
    }

    Node.call(this, parent, $el);

    this.filter = null;
    this.operator = null;
    this.flags = {};
};

Rule.prototype = Object.create(Node.prototype);
Rule.prototype.constructor = Rule;

defineModelProperties(Rule, ['filter', 'operator', 'flags']);


QueryBuilder.Group = Group;
QueryBuilder.Rule = Rule;

/**
 * Utility to iterate over radio/checkbox/selection options.
 * it accept three formats: array of values, map, array of 1-element maps
 *
 * @param options {object|array}
 * @param tpl {callable} (takes key and text)
 */
function iterateOptions(options, tpl) {
    if (options) {
        if ($.isArray(options)) {
            options.forEach(function(entry) {
                // array of one-element maps
                if ($.isPlainObject(entry)) {
                    $.each(entry, function(key, val) {
                        tpl(key, val);
                        return false; // break after first entry
                    });
                }
                // array of values
                else {
                    tpl(entry, entry);
                }
            });
        }
        // unordered map
        else {
            $.each(options, function(key, val) {
                tpl(key, val);
            });
        }
    }
}

/**
 * Replaces {0}, {1}, ... in a string
 * @param str {string}
 * @param args,... {string|int|float}
 * @return {string}
 */
function fmt(str, args) {
    args = Array.prototype.slice.call(arguments);

    return str.replace(/{([0-9]+)}/g, function(m, i) {
        return args[parseInt(i)+1];
    });
}

/**
 * Output internal error with jQuery.error
 * @see fmt
 */
function error() {
    $.error(fmt.apply(null, arguments));
}

/**
 * Change type of a value to int or float
 * @param value {mixed}
 * @param type {string} 'integer', 'double' or anything else
 * @param boolAsInt {boolean} return 0 or 1 for booleans
 * @return {mixed}
 */
function changeType(value, type, boolAsInt) {
    switch (type) {
        case 'integer': return parseInt(value);
        case 'double': return parseFloat(value);
        case 'boolean':
            var bool = value.trim().toLowerCase() === "true" || value.trim() === '1' || value === 1;
            return  boolAsInt ? (bool ? 1 : 0) : bool;
        default: return value;
    }
}

/**
 * Escape string like mysql_real_escape_string
 * @param value {string}
 * @return {string}
 */
function escapeString(value) {
    if (typeof value !== 'string') {
        return value;
    }

    return value
      .replace(/[\0\n\r\b\\\'\"]/g, function(s) {
          switch(s) {
              case '\0': return '\\0';
              case '\n': return '\\n';
              case '\r': return '\\r';
              case '\b': return '\\b';
              default:   return '\\' + s;
          }
      })
      // uglify compliant
      .replace(/\t/g, '\\t')
      .replace(/\x1a/g, '\\Z');
}

/**
 * Escape value for use in regex
 * @param value {string}
 * @return {string}
 */
function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

$.fn.queryBuilder = function(option) {
    if (this.length > 1) {
        error('Unable to initialize on multiple target');
    }

    var data = this.data('queryBuilder'),
        options = (typeof option == 'object' && option) || {};

    if (!data && option == 'destroy') {
        return this;
    }
    if (!data) {
        this.data('queryBuilder', new QueryBuilder(this, options));
    }
    if (typeof option == 'string') {
        return data[option].apply(data, Array.prototype.slice.call(arguments, 1));
    }

    return this;
};

$.fn.queryBuilder.constructor = QueryBuilder;
$.fn.queryBuilder.defaults = QueryBuilder.defaults;
$.fn.queryBuilder.extend = QueryBuilder.extend;
$.fn.queryBuilder.define = QueryBuilder.define;

/*!
 * jQuery QueryBuilder Awesome Bootstrap Checkbox
 * Applies Awesome Bootstrap Checkbox for checkbox and radio inputs.
 * Copyright 2014-2015 Damien "Mistic" Sorel (http://www.strangeplanet.fr)
 */

QueryBuilder.define('bt-checkbox', function(options) {
    if (options.font == 'glyphicons') {
        var injectCSS = document.createElement('style');
        injectCSS.innerHTML = '\
.checkbox input[type=checkbox]:checked + label:after { \
    font-family: "Glyphicons Halflings"; \
    content: "\\e013"; \
} \
.checkbox label:after { \
    padding-left: 4px; \
    padding-top: 2px; \
    font-size: 9px; \
}';
        document.body.appendChild(injectCSS);
    }

    this.on('getRuleInput.filter', function(h, rule, name) {
        var filter = rule.filter;

        if ((filter.input === 'radio' || filter.input === 'checkbox') && !filter.plugin) {
            h.value = '';

            if (!filter.colors) {
                filter.colors = {};
            }
            if (filter.color) {
                filter.colors._def_ = filter.color;
            }

            var style = filter.vertical ? ' style="display:block"' : '',
                i = 0, color, id;

            iterateOptions(filter.values, function(key, val) {
                color = filter.colors[key] || filter.colors._def_ || options.color;
                id = name +'_'+ (i++);

                h.value+= '\
<div'+ style +' class="'+ filter.input +' '+ filter.input +'-'+ color +'"> \
  <input type="'+ filter.input +'" name="'+ name +'" id="'+ id +'" value="'+ key +'"> \
  <label for="'+ id +'">'+ val +'</label> \
</div>';
            });
        }
    });
}, {
    font: 'glyphicons',
    color: 'default'
});

/*!
 * jQuery QueryBuilder Bootstrap Selectpicker
 * Applies Bootstrap Select on filters and operators combo-boxes.
 * Copyright 2014-2015 Damien "Mistic" Sorel (http://www.strangeplanet.fr)
 */

QueryBuilder.define('bt-selectpicker', function(options) {
    if (!$.fn.selectpicker || !$.fn.selectpicker.Constructor) {
        error('Bootstrap Select is required to use "bt-selectpicker" plugin. Get it here: http://silviomoreto.github.io/bootstrap-select');
    }

    // init selectpicker
    this.on('afterCreateRuleFilters', function(e, rule) {
        rule.$el.find('.rule-filter-container select').removeClass('form-control').selectpicker(options);
    });

    this.on('afterCreateRuleOperators', function(e, rule) {
        rule.$el.find('.rule-operator-container select').removeClass('form-control').selectpicker(options);
    });

    // update selectpicker on change
    this.on('afterUpdateRuleFilter', function(e, rule) {
        rule.$el.find('.rule-filter-container select').selectpicker('render');
    });

    this.on('afterUpdateRuleOperator', function(e, rule) {
        rule.$el.find('.rule-operator-container select').selectpicker('render');
    });
}, {
    container: 'body',
    style: 'btn-inverse btn-xs',
    width: 'auto',
    showIcon: false
});

/*!
 * jQuery QueryBuilder Bootstrap Tooltip errors
 * Applies Bootstrap Tooltips on validation error messages.
 * Copyright 2014-2015 Damien "Mistic" Sorel (http://www.strangeplanet.fr)
 */

QueryBuilder.define('bt-tooltip-errors', function(options) {
    if (!$.fn.tooltip || !$.fn.tooltip.Constructor || !$.fn.tooltip.Constructor.prototype.fixTitle) {
        error('Bootstrap Tooltip is required to use "bt-tooltip-errors" plugin. Get it here: http://getbootstrap.com');
    }

    var self = this;

    // add BT Tooltip data
    this.on('getRuleTemplate.filter', function(h) {
        h.value = h.value.replace('class="error-container"', 'class="error-container" data-toggle="tooltip"');
    });

    this.on('getGroupTemplate.filter', function(h) {
        h.value = h.value.replace('class="error-container"', 'class="error-container" data-toggle="tooltip"');
    });

    // init/refresh tooltip when title changes
    this.model.on('update', function(e, node, field) {
        if (field == 'error' && self.settings.display_errors) {
            node.$el.find('.error-container').eq(0)
              .tooltip(options)
              .tooltip('hide')
              .tooltip('fixTitle');
        }
    });
}, {
    placement: 'right'
});

/*!
 * jQuery QueryBuilder Filter Description
 * Provides three ways to display a description about a filter: inline, Bootsrap Popover or Bootbox.
 * Copyright 2014-2015 Damien "Mistic" Sorel (http://www.strangeplanet.fr)
 */

QueryBuilder.define('filter-description', function(options) {
    /**
     * INLINE
     */
    if (options.mode === 'inline') {
        this.on('afterUpdateRuleFilter', function(e, rule) {
            var $p = rule.$el.find('p.filter-description');

            if (!rule.filter || !rule.filter.description) {
                $p.hide();
            }
            else {
                if ($p.length === 0) {
                    $p = $('<p class="filter-description"></p>');
                    $p.appendTo(rule.$el);
                }
                else {
                    $p.show();
                }

                $p.html('<i class="' + options.icon + '"></i> ' + rule.filter.description);
            }
        });
    }
    /**
     * POPOVER
     */
    else if (options.mode === 'popover') {
        if (!$.fn.popover || !$.fn.popover.Constructor || !$.fn.popover.Constructor.prototype.fixTitle) {
            error('Bootstrap Popover is required to use "filter-description" plugin. Get it here: http://getbootstrap.com');
        }

        this.on('afterUpdateRuleFilter', function(e, rule) {
            var $b = rule.$el.find('button.filter-description');

            if (!rule.filter || !rule.filter.description) {
                $b.hide();

                if ($b.data('bs.popover')) {
                    $b.popover('hide');
                }
            }
            else {
                if ($b.length === 0) {
                    $b = $('<button type="button" class="btn btn-xs btn-info filter-description" data-toggle="popover"><i class="' + options.icon + '"></i></button>');
                    $b.prependTo(rule.$el.find('.rule-actions'));

                    $b.popover({
                        placement: 'left',
                        container: 'body',
                        html: true
                    });

                    $b.on('mouseout', function() {
                        $b.popover('hide');
                    });
                }
                else {
                    $b.show();
                }

                $b.data('bs.popover').options.content = rule.filter.description;

                if ($b.attr('aria-describedby')) {
                    $b.popover('show');
                }
            }
        });
    }
    /**
     * BOOTBOX
     */
    else if (options.mode === 'bootbox') {
        if (!('bootbox' in window)) {
            error('Bootbox is required to use "filter-description" plugin. Get it here: http://bootboxjs.com');
        }

        this.on('afterUpdateRuleFilter', function(e, rule) {
            var $b = rule.$el.find('button.filter-description');

            if (!rule.filter || !rule.filter.description) {
                $b.hide();
            }
            else {
                if ($b.length === 0) {
                    $b = $('<button type="button" class="btn btn-xs btn-info filter-description" data-toggle="bootbox"><i class="' + options.icon + '"></i></button>');
                    $b.prependTo(rule.$el.find('.rule-actions'));

                    $b.on('click', function() {
                        bootbox.alert($b.data('description'));
                    });
                }

                $b.data('description', rule.filter.description);
            }
        });
    }
}, {
    icon: 'glyphicon glyphicon-info-sign',
    mode: 'popover'
});

/*!
 * jQuery QueryBuilder Loopback Support
 * Allows to export rules as a Loopback statement.
 * Copyright 2015 Fabien Franzen (http://www.atelierfabien.be)
 */

// DEFAULT CONFIG
// ===============================
QueryBuilder.defaults({
    loopbackOperators: {
        equal:            function(v){ return v[0]; },
        sub_query:        function(v){ return v[0]; },
        like:        function(v){ return v[0]; },
        not_like:        function(v){ return v[0]; },
        greater_by_x_days:        function(v){ return v[0]; },
        less_by_x_days:        function(v){ return v[0]; },
        not_equal:        function(v){ return {'neq': v[0]}; },
        in:               function(v){ return {'inq': v}; },
        not_in:           function(v){ return {'nin': v}; },
        less:             function(v){ return {'lt': v[0]}; },
        less_or_equal:    function(v){ return {'lte': v[0]}; },
        greater:          function(v){ return {'gt': v[0]}; },
        greater_or_equal: function(v){ return {'gte': v[0]}; },
        between:          function(v){ return {'between': v}; },
        begins_with:      function(v){ return {'like': '^' + escapeRegExp(v[0])}; },
        not_begins_with:  function(v){ return {'nlike': '^' + escapeRegExp(v[0])}; },
        contains:         function(v){ return {'like': escapeRegExp(v[0])}; },
        not_contains:     function(v){ return {'nlike': escapeRegExp(v[0])}; },
        ends_with:        function(v){ return {'like': escapeRegExp(v[0]) + '$'}; },
        not_ends_with:    function(v){ return {'nlike': escapeRegExp(v[0]) + '$'}; },
        is_empty:         function(v){ return ''; },
        is_not_empty:     function(v){ return {'neq': ''}; },
        is_null:          function(v){ return null; },
        is_not_null:      function(v){ return {'neq': null}; }
    }
});


// PUBLIC METHODS
// ===============================
QueryBuilder.extend({
    /**
     * Get rules as Loopback query
     * @param data {object} (optional) rules
     * @return {object}
     */
    getLoopback: function(data) {
        data = (data===undefined) ? this.getRules() : data;

        var that = this;

        return (function parse(data) {
            if (!data.condition) {
                data.condition = that.settings.default_condition;
            }
            if (['AND', 'OR'].indexOf(data.condition.toUpperCase()) === -1) {
                error('Unable to build Loopback query with condition "{0}"', data.condition);
            }

            if (!data.rules) {
                return {};
            }

            var parts = [];

            data.rules.forEach(function(rule) {
                if (rule.rules && rule.rules.length>0) {
                    parts.push(parse(rule));
                }
                else {
                    var mdb = that.settings.loopbackOperators[rule.operator],
                        ope = that.getOperatorByType(rule.operator),
                        values = [];

                    if (mdb === undefined) {
                        error('Unknown Loopback operation for operator "{0}"', rule.operator);
                    }

                    if (ope.nb_inputs !== 0) {
                        if (!(rule.value instanceof Array)) {
                            rule.value = [rule.value];
                        }

                        rule.value.forEach(function(v) {
                            values.push(changeType(v, rule.type));
                        });
                    }

                    var part = {};
                    part[rule.field] = mdb.call(that, values);
                    parts.push(part);
                }
            });

            var res = {};
            if (parts.length > 0) {
                res[ data.condition.toLowerCase() ] = parts;
            }
            return res;
        }(data));
    }
});

/*!
 * jQuery QueryBuilder MongoDB Support
 * Allows to export rules as a MongoDB find object as well as populating the builder from a MongoDB object.
 * Copyright 2014-2015 Damien "Mistic" Sorel (http://www.strangeplanet.fr)
 */

// DEFAULT CONFIG
// ===============================
QueryBuilder.defaults({
    mongoOperators: {
        equal:            function(v){ return v[0]; },
        not_equal:        function(v){ return {'$ne': v[0]}; },
        in:               function(v){ return {'$in': v}; },
        not_in:           function(v){ return {'$nin': v}; },
        less:             function(v){ return {'$lt': v[0]}; },
        less_or_equal:    function(v){ return {'$lte': v[0]}; },
        greater:          function(v){ return {'$gt': v[0]}; },
        greater_or_equal: function(v){ return {'$gte': v[0]}; },
        between:          function(v){ return {'$gte': v[0], '$lte': v[1]}; },
        begins_with:      function(v){ return {'$regex': '^' + escapeRegExp(v[0])}; },
        not_begins_with:  function(v){ return {'$regex': '^(?!' + escapeRegExp(v[0]) + ')'}; },
        contains:         function(v){ return {'$regex': escapeRegExp(v[0])}; },
        not_contains:     function(v){ return {'$regex': '^((?!' + escapeRegExp(v[0]) + ').)*$', '$options': 's'}; },
        ends_with:        function(v){ return {'$regex': escapeRegExp(v[0]) + '$'}; },
        not_ends_with:    function(v){ return {'$regex': '(?<!' + escapeRegExp(v[0]) + ')$'}; },
        is_empty:         function(v){ return ''; },
        is_not_empty:     function(v){ return {'$ne': ''}; },
        is_null:          function(v){ return null; },
        is_not_null:      function(v){ return {'$ne': null}; }
    },

    mongoRuleOperators: {
        $ne: function(v) {
            v = v.$ne;
            return {
                'val': v,
                'op': v === null ? 'is_not_null' : (v === '' ? 'is_not_empty' : 'not_equal')
            };
        },
        eq: function(v) {
            return {
                'val': v,
                'op': v === null ? 'is_null' : (v === '' ? 'is_empty' : 'equal')
            };
        },
        $regex: function(v) {
            v = v.$regex;
            if (v.slice(0,4) == '^(?!' && v.slice(-1) == ')') {
                return { 'val': v.slice(4,-1), 'op': 'not_begins_with' };
            }
            else if (v.slice(0,5) == '^((?!' && v.slice(-5) == ').)*$') {
                return { 'val': v.slice(5,-5), 'op': 'not_contains' };
            }
            else if (v.slice(0,4) == '(?<!' && v.slice(-2) == ')$') {
                return { 'val': v.slice(4,-2), 'op': 'not_ends_with' };
            }
            else if (v.slice(-1) == '$') {
                return { 'val': v.slice(0,-1), 'op': 'ends_with' };
            }
            else if (v.slice(0,1) == '^') {
                return { 'val': v.slice(1), 'op': 'begins_with' };
            }
            else {
                return { 'val': v, 'op': 'contains' };
            }
        },
        between : function(v) { return {'val': [v.$gte, v.$lte], 'op': 'between'}; },
        $in :     function(v) { return {'val': v.$in, 'op': 'in'}; },
        $nin :    function(v) { return {'val': v.$nin, 'op': 'not_in'}; },
        $lt :     function(v) { return {'val': v.$lt, 'op': 'less'}; },
        $lte :    function(v) { return {'val': v.$lte, 'op': 'less_or_equal'}; },
        $gt :     function(v) { return {'val': v.$gt, 'op': 'greater'}; },
        $gte :    function(v) { return {'val': v.$gte, 'op': 'greater_or_equal'}; }
    }
});


// PUBLIC METHODS
// ===============================
QueryBuilder.extend({
    /**
     * Get rules as MongoDB query
     * @param data {object} (optional) rules
     * @return {object}
     */
    getMongo: function(data) {
        data = (data===undefined) ? this.getRules() : data;

        var that = this;

        return (function parse(data) {
            if (!data.condition) {
                data.condition = that.settings.default_condition;
            }
            if (['AND', 'OR'].indexOf(data.condition.toUpperCase()) === -1) {
                error('Unable to build MongoDB query with condition "{0}"', data.condition);
            }

            if (!data.rules) {
                return {};
            }

            var parts = [];

            data.rules.forEach(function(rule) {
                if (rule.rules && rule.rules.length>0) {
                    parts.push(parse(rule));
                }
                else {
                    var mdb = that.settings.mongoOperators[rule.operator],
                        ope = that.getOperatorByType(rule.operator),
                        values = [];

                    if (mdb === undefined) {
                        error('Unknown MongoDB operation for operator "{0}"', rule.operator);
                    }

                    if (ope.nb_inputs !== 0) {
                        if (!(rule.value instanceof Array)) {
                            rule.value = [rule.value];
                        }

                        rule.value.forEach(function(v) {
                            values.push(changeType(v, rule.type, false));
                        });
                    }

                    var part = {};
                    part[rule.field] = mdb.call(that, values);
                    parts.push(part);
                }
            });

            var res = {};
            if (parts.length > 0) {
                res['$'+data.condition.toLowerCase()] = parts;
            }
            return res;
        }(data));
    },

    /**
     * Convert MongoDB object to rules
     * @param data {object} query object
     * @return {object}
     */
    getRulesFromMongo: function(data) {
        if (data === undefined || data === null) {
            return null;
        }

        var that = this,
            conditions = ['$and','$or'];

        return (function parse(data) {
            var topKeys = Object.keys(data);

            if (topKeys.length > 1) {
                error('Invalid MongoDB query format.');
            }
            if (conditions.indexOf(topKeys[0].toLowerCase()) === -1) {
                error('Unable to build Rule from MongoDB query with condition "{0}"', topKeys[0]);
            }

            var condition = topKeys[0].toLowerCase() === conditions[0] ? 'AND' : 'OR',
                rules = data[topKeys[0]],
                parts = [];

            rules.forEach(function(rule) {
                var keys = Object.keys(rule);

                if (conditions.indexOf(keys[0].toLowerCase()) !== -1) {
                    parts.push(parse(rule));
                }
                else {
                    var field = keys[0],
                        value = rule[field];

                    var operator = that.determineMongoOperator(value, field);
                    if (operator === undefined) {
                        error('Invalid MongoDB query format.');
                    }

                    var mdbrl = that.settings.mongoRuleOperators[operator];
                    if (mdbrl === undefined) {
                        error('JSON Rule operation unknown for operator "{0}"', operator);
                    }

                    var opVal = mdbrl.call(that, value);
                    parts.push({
                        id: that.change('getMongoDBFieldID', field, value),
                        field: field,
                        operator: opVal.op,
                        value: opVal.val
                    });
                }
            });

            var res = {};
            if (parts.length > 0) {
                res.condition = condition;
                res.rules = parts;
            }
            return res;
        }(data));
    },

    /**
     * Find which operator is used in a MongoDB sub-object
     * @param {mixed} value
     * @param {string} field
     * @return {string|undefined}
     */
    determineMongoOperator: function(value, field) {
        if (value !== null && typeof value === 'object') {
            var subkeys = Object.keys(value);

            if (subkeys.length === 1) {
                return subkeys[0];
            }
            else {
                if (value.$gte !==undefined && value.$lte !==undefined) {
                    return 'between';
                }
                else if (value.$regex !==undefined) { // optional $options
                    return '$regex';
                }
                else {
                    return;
                }
            }
        }
        else {
            return 'eq';
        }
    },

    /**
     * Set rules from MongoDB object
     * @param data {object}
     */
    setRulesFromMongo: function(data) {
        this.setRules(this.getRulesFromMongo(data));
    }
});

/*!
 * jQuery QueryBuilder Sortable
 * Enables drag & drop sort of rules.
 * Copyright 2014-2015 Damien "Mistic" Sorel (http://www.strangeplanet.fr)
 */

QueryBuilder.define('sortable', function(options) {
    /**
     * Init HTML5 drag and drop
     */
    this.on('afterInit', function(e) {
        // configure jQuery to use dataTransfer
        $.event.props.push('dataTransfer');

        var placeholder, src,
            self = e.builder;

        // only add "draggable" attribute when hovering drag handle
        // preventing text select bug in Firefox
        self.$el.on('mouseover', '.drag-handle', function() {
            self.$el.find('.rule-container, .rules-group-container').attr('draggable', true);
        });
        self.$el.on('mouseout', '.drag-handle', function() {
            self.$el.find('.rule-container, .rules-group-container').removeAttr('draggable');
        });

        // dragstart: create placeholder and hide current element
        self.$el.on('dragstart', '[draggable]', function(e) {
            e.stopPropagation();

            // notify drag and drop (only dummy text)
            e.dataTransfer.setData('text', 'drag');

            src = Model(e.target);

            // Chrome glitchs
            // - helper invisible if hidden immediately
            // - "dragend" is called immediately if we modify the DOM directly
            setTimeout(function() {
                var ph = $('<div class="rule-placeholder">&nbsp;</div>');
                ph.css('min-height', src.$el.height());

                placeholder = src.parent.addRule(ph, src.getPos());

                src.$el.hide();
            }, 0);
        });

        // dragenter: move the placeholder
        self.$el.on('dragenter', '[draggable]', function(e) {
            e.preventDefault();
            e.stopPropagation();

            if (placeholder) {
                moveSortableToTarget(placeholder, $(e.target));
            }
        });

        // dragover: prevent glitches
        self.$el.on('dragover', '[draggable]', function(e) {
            e.preventDefault();
            e.stopPropagation();
        });

        // drop: move current element
        self.$el.on('drop', function(e) {
            e.preventDefault();
            e.stopPropagation();

            moveSortableToTarget(src, $(e.target));
        });

        // dragend: show current element and delete placeholder
        self.$el.on('dragend', '[draggable]', function(e) {
            e.preventDefault();
            e.stopPropagation();

            src.$el.show();
            placeholder.drop();

            src = placeholder = null;

            self.$el.find('.rule-container, .rules-group-container').removeAttr('draggable');
        });
    });

    /**
     * Remove drag handle from non-sortable rules
     */
    this.on('parseRuleFlags.filter', function(flags) {
        if (flags.value.no_sortable === undefined) {
            flags.value.no_sortable = options.default_no_sortable;
        }
    });

    this.on('afterApplyRuleFlags', function(e, rule) {
        if (rule.flags.no_sortable) {
            rule.$el.find('.drag-handle').remove();
        }
    });

    /**
     * Modify templates
     */
    this.on('getGroupTemplate.filter', function(h, level) {
        if (level>1) {
            var $h = $(h.value);
            $h.find('.group-conditions').after('<div class="drag-handle"><i class="' + options.icon + '"></i></div>');
            h.value = $h.prop('outerHTML');
        }
    });

    this.on('getRuleTemplate.filter', function(h) {
        var $h = $(h.value);
        $h.find('.rule-header').after('<div class="drag-handle"><i class="' + options.icon + '"></i></div>');
        h.value = $h.prop('outerHTML');
    });
}, {
    default_no_sortable: false,
    icon: 'glyphicon glyphicon-sort'
});

/**
 * Move an element (placeholder or actual object) depending on active target
 * @param {Node}
 * @param {jQuery}
 */
function moveSortableToTarget(element, target) {
    var parent;

    // on rule
    parent = target.closest('.rule-container');
    if (parent.length) {
        element.moveAfter(Model(parent));
        return;
    }

    // on group header
    parent = target.closest('.rules-group-header');
    if (parent.length) {
        parent = target.closest('.rules-group-container');
        element.moveAtBegin(Model(parent));
        return;
    }

    // on group
    parent = target.closest('.rules-group-container');
    if (parent.length) {
        element.moveAtEnd(Model(parent));
        return;
    }
}

/*!
 * jQuery QueryBuilder SQL Support
 * Allows to export rules as a SQL WHERE statement.
 * Copyright 2014-2015 Damien "Mistic" Sorel (http://www.strangeplanet.fr)
 */

// DEFAULT CONFIG
// ===============================
QueryBuilder.defaults({
    sqlOperators: {
        equal:            '= ?',
        sub_query:        '= ?',
        like:        { op: 'LIKE(?)',     fn: function(v){ return '%'+v+'%'; } },
        not_like:    { op: 'NOT LIKE(?)',     fn: function(v){ return '%'+v+'%'; } },
        greater_by_x_days:        'GREATER_BY_X_DAYS ?',
        less_by_x_days:        'LESS_BY_X_DAYS ?',
        not_equal:        '!= ?',
        in:               { op: 'IN(?)',     sep: ', ' },
        not_in:           { op: 'NOT IN(?)', sep: ', ' },
        less:             '< ?',
        less_or_equal:    '<= ?',
        greater:          '> ?',
        greater_or_equal: '>= ?',
        between:          { op: 'BETWEEN ?',   sep: ' AND ' },
        begins_with:      { op: 'LIKE(?)',     fn: function(v){ return v+'%'; } },
        not_begins_with:  { op: 'NOT LIKE(?)', fn: function(v){ return v+'%'; } },
        contains:         { op: 'LIKE(?)',     fn: function(v){ return '%'+v+'%'; } },
        not_contains:     { op: 'NOT LIKE(?)', fn: function(v){ return '%'+v+'%'; } },
        ends_with:        { op: 'LIKE(?)',     fn: function(v){ return '%'+v; } },
        not_ends_with:    { op: 'NOT LIKE(?)', fn: function(v){ return '%'+v; } },
        is_empty:         '== ""',
        is_not_empty:     '!= ""',
        is_null:          'IS NULL',
        is_not_null:      'IS NOT NULL'
    },

    sqlStatements: {
        'question_mark': function() {
            var bind_params = [];
            return {
                add: function(rule, value) {
                    bind_params.push(value);
                    return '?';
                },
                run: function() {
                    return bind_params;
                }
            };
        },

        'numbered': function() {
            var bind_index = 0;
            var bind_params = [];
            return {
                add: function(rule, value) {
                    bind_params.push(value);
                    bind_index++;
                    return '$' + bind_index;
                },
                run: function() {
                    return bind_params;
                }
            };
        },

        'named': function() {
            var bind_index = {};
            var bind_params = {};
            return {
                add: function(rule, value) {
                    if (!bind_index[rule.field]) bind_index[rule.field] = 0;
                    bind_index[rule.field]++;
                    var key = rule.field + '_' + bind_index[rule.field];
                    bind_params[key] = value;
                    return ':' + key;
                },
                run: function() {
                    return bind_params;
                }
            };
        }
    }
});


// PUBLIC METHODS
// ===============================
QueryBuilder.extend({
    /**
     * Get rules as SQL query
     * @param stmt {false|string} use prepared statements - false, 'question_mark' or 'numbered'
     * @param nl {bool} output with new lines
     * @param data {object} (optional) rules
     * @return {object}
     */
    getSQL: function(stmt, nl, data) {
        data = (data===undefined) ? this.getRules() : data;
        nl = (nl===true) ? '\n' : ' ';

        if (stmt===true || stmt===undefined) stmt = 'question_mark';
        if (typeof stmt == 'string') stmt = this.settings.sqlStatements[stmt]();

        var that = this,
            bind_index = 1,
            bind_params = [];

        var sql = (function parse(data) {
            if (!data.condition) {
                data.condition = that.settings.default_condition;
            }
            if (['AND', 'OR'].indexOf(data.condition.toUpperCase()) === -1) {
                error('Unable to build SQL query with condition "{0}"', data.condition);
            }

            if (!data.rules) {
                return '';
            }

            var parts = [];

            data.rules.forEach(function(rule) {
                if (rule.rules && rule.rules.length>0) {
                    parts.push('('+ nl + parse(rule) + nl +')'+ nl);
                }
                else {
                    var sql = that.getSqlOperator(rule.operator),
                        ope = that.getOperatorByType(rule.operator),
                        value = '';

                    if (sql === false) {
                        error('Unknown SQL operation for operator "{0}"', rule.operator);
                    }

                    if (ope.nb_inputs !== 0) {
                        if (!(rule.value instanceof Array)) {
                            rule.value = [rule.value];
                        }

                        rule.value.forEach(function(v, i) {
                            if (i>0) {
                                value+= sql.sep;
                            }

                            if (rule.type=='integer' || rule.type=='double' || rule.type=='boolean') {
                                v = changeType(v, rule.type, true);
                            }
                            else if (!stmt) {
                                v = escapeString(v);
                            }

                            if (sql.fn) {
                                v = sql.fn(v);
                            }

                            if (stmt) {
                                value+= stmt.add(rule, v);
                            }
                            else {
                                if (typeof v === 'string') {
                                    v = '\''+ v +'\'';
                                }

                                value+= v;
                            }
                        });
                    }

                    parts.push(rule.field +' '+ sql.op.replace(/\?/, value));
                }
            });

            return parts.join(' '+ data.condition + nl);
        }(data));

        if (stmt) {
            return {
                sql: sql,
                params: stmt.run()
            };
        }
        else {
            return {
                sql: sql
            };
        }
    },

    /**
     * Sanitize the "sql" field of an operator
     * @param sql {string|object}
     * @return {object}
     */
    getSqlOperator: function(type) {
        var sql = this.settings.sqlOperators[type];

        if (sql === undefined) {
            return false;
        }

        if (typeof sql == 'string') {
            sql = { op: sql };
        }
        if (sql.list && !sql.sep) {
            sql.sep = ', ';
        }

        return sql;
    }
});

/*!
 * jQuery QueryBuilder Unique Filter
 * Allows to define some filters as "unique": ie which can be used for only one rule, globally or in the same group.
 * Copyright 2014-2015 Damien "Mistic" Sorel (http://www.strangeplanet.fr)
 */

QueryBuilder.define('unique-filter', function() {
    this.status.used_filters = {};

    this.on('afterUpdateRuleFilter', this.updateDisabledFilters);
    this.on('afterDeleteRule', this.updateDisabledFilters);
    this.on('afterCreateRuleFilters', this.applyDisabledFilters);
});


QueryBuilder.define('bt-tooltip-errors', function(options) {
    if (!$.fn.tooltip || !$.fn.tooltip.Constructor || !$.fn.tooltip.Constructor.prototype.fixTitle) {
        error('Bootstrap Tooltip is required to use "bt-tooltip-errors" plugin. Get it here: http://getbootstrap.com');
    }

    var self = this;

    // add BT Tooltip data
    this.on('getRuleTemplate.filter', function(h) {
        h.value = h.value.replace('class="error-container"', 'class="error-container" data-toggle="tooltip"');
    });

    this.on('getGroupTemplate.filter', function(h) {
        h.value = h.value.replace('class="error-container"', 'class="error-container" data-toggle="tooltip"');
    });

    // init/refresh tooltip when title changes
    this.model.on('update', function(e, node, field) {
        if (field == 'error' && self.settings.display_errors) {
            node.$el.find('.error-container').eq(0)
              .tooltip(options)
              .tooltip('hide')
              .tooltip('fixTitle');
        }
    });
}, {
    placement: 'right'
});



QueryBuilder.define('unique-filter', function() {
    this.status.used_filters = {};

    this.on('afterUpdateRuleFilter', this.updateDisabledFilters);
    this.on('afterDeleteRule', this.updateDisabledFilters);
    this.on('afterCreateRuleFilters', this.applyDisabledFilters);
});

QueryBuilder.extend({
    updateDisabledFilters: function(e) {
        var self = e.builder;
        self.status.used_filters = {};

        if (!self.model) {
            return;
        }

        // get used filters
        (function walk(group) {
            group.each(function(rule) {
                if (rule.filter && rule.filter.unique) {
                    if (!self.status.used_filters[rule.filter.id]) {
                        self.status.used_filters[rule.filter.id] = [];
                    }
                    if (rule.filter.unique == 'group') {
                        self.status.used_filters[rule.filter.id].push(rule.parent);
                    }
                }
            }, function(group) {
                walk(group);
            });
        }(self.model.root));

        self.applyDisabledFilters(e);
    },

    applyDisabledFilters: function(e) {
        var self = e.builder;

        // re-enable everything
        self.$el.find('.rule-filter-container option').prop('disabled', false);

        // disable some
        $.each(self.status.used_filters, function(filterId, groups) {
            if (groups.length === 0) {
                self.$el.find('.rule-filter-container option[value="' + filterId + '"]:not(:selected)').prop('disabled', true);
            }
            else {
                groups.forEach(function(group) {
                    group.each(function(rule) {
                        rule.$el.find('.rule-filter-container option[value="' + filterId + '"]:not(:selected)').prop('disabled', true);
                    });
                });
            }
        });

        // update Selectpicker
        if (self.settings.plugins && self.settings.plugins['bt-selectpicker']) {
            self.$el.find('.rule-filter-container select').selectpicker('render');
        }
    }
});

/*!
 * jQuery QueryBuilder Filter Description
 * Provides three ways to display a description about a filter: inline, Bootsrap Popover or Bootbox.
 * Copyright 2014-2015 Damien "Mistic" Sorel (http://www.strangeplanet.fr)
 */

QueryBuilder.define('filter-description', function(options) {
    /**
     * INLINE
     */
    if (options.mode === 'inline') {
        this.on('afterUpdateRuleFilter', function(e, rule) {
            var $p = rule.$el.find('p.filter-description');

            if (!rule.filter || !rule.filter.description) {
                $p.hide();
            }
            else {
                if ($p.length === 0) {
                    $p = $('<p class="filter-description"></p>');
                    $p.appendTo(rule.$el);
                }
                else {
                    $p.show();
                }

                $p.html('<i class="' + options.icon + '"></i> ' + rule.filter.description);
            }
        });
    }
    /**
     * POPOVER
     */
    else if (options.mode === 'popover') {
        if (!$.fn.popover || !$.fn.popover.Constructor || !$.fn.popover.Constructor.prototype.fixTitle) {
            error('Bootstrap Popover is required to use "filter-description" plugin. Get it here: http://getbootstrap.com');
        }

        this.on('afterUpdateRuleFilter', function(e, rule) {
            var $b = rule.$el.find('button.filter-description');

            if (!rule.filter || !rule.filter.description) {
                $b.hide();

                if ($b.data('bs.popover')) {
                    $b.popover('hide');
                }
            }
            else {
                if ($b.length === 0) {
                    $b = $('<button type="button" class="btn btn-xs btn-info filter-description" data-toggle="popover"><i class="' + options.icon + '"></i></button>');
                    $b.prependTo(rule.$el.find('.rule-actions'));

                    $b.popover({
                        placement: 'left',
                        container: 'body',
                        html: true
                    });

                    $b.on('mouseout', function() {
                        $b.popover('hide');
                    });
                }
                else {
                    $b.show();
                }

                $b.data('bs.popover').options.content = rule.filter.description;

                if ($b.attr('aria-describedby')) {
                    $b.popover('show');
                }
            }
        });
    }
    /**
     * BOOTBOX
     */
    else if (options.mode === 'bootbox') {
        if (!('bootbox' in window)) {
            error('Bootbox is required to use "filter-description" plugin. Get it here: http://bootboxjs.com');
        }

        this.on('afterUpdateRuleFilter', function(e, rule) {
            var $b = rule.$el.find('button.filter-description');

            if (!rule.filter || !rule.filter.description) {
                $b.hide();
            }
            else {
                if ($b.length === 0) {
                    $b = $('<button type="button" class="btn btn-xs btn-info filter-description" data-toggle="bootbox"><i class="' + options.icon + '"></i></button>');
                    $b.prependTo(rule.$el.find('.rule-actions'));

                    $b.on('click', function() {
                        bootbox.alert($b.data('description'));
                    });
                }

                $b.data('description', rule.filter.description);
            }
        });
    }
}, {
    icon: 'glyphicon glyphicon-info-sign',
    mode: 'popover'
});


/*!
 * jQuery QueryBuilder Sortable
 * Enables drag & drop sort of rules.
 * Copyright 2014-2015 Damien "Mistic" Sorel (http://www.strangeplanet.fr)
 */

QueryBuilder.define('sortable', function(options) {
    /**
     * Init HTML5 drag and drop
     */
    this.on('afterInit', function(e) {
        // configure jQuery to use dataTransfer
        $.event.props.push('dataTransfer');

        var placeholder, src,
            self = e.builder;

        // only add "draggable" attribute when hovering drag handle
        // preventing text select bug in Firefox
        self.$el.on('mouseover', '.drag-handle', function() {
            self.$el.find('.rule-container, .rules-group-container').attr('draggable', true);
        });
        self.$el.on('mouseout', '.drag-handle', function() {
            self.$el.find('.rule-container, .rules-group-container').removeAttr('draggable');
        });

        // dragstart: create placeholder and hide current element
        self.$el.on('dragstart', '[draggable]', function(e) {
            e.stopPropagation();

            // notify drag and drop (only dummy text)
            e.dataTransfer.setData('text', 'drag');

            src = Model(e.target);

            // Chrome glitchs
            // - helper invisible if hidden immediately
            // - "dragend" is called immediately if we modify the DOM directly
            setTimeout(function() {
                var ph = $('<div class="rule-placeholder">&nbsp;</div>');
                ph.css('min-height', src.$el.height());

                placeholder = src.parent.addRule(ph, src.getPos());

                src.$el.hide();
            }, 0);
        });

        // dragenter: move the placeholder
        self.$el.on('dragenter', '[draggable]', function(e) {
            e.preventDefault();
            e.stopPropagation();

            if (placeholder) {
                moveSortableToTarget(placeholder, $(e.target));
            }
        });

        // dragover: prevent glitches
        self.$el.on('dragover', '[draggable]', function(e) {
            e.preventDefault();
            e.stopPropagation();
        });

        // drop: move current element
        self.$el.on('drop', function(e) {
            e.preventDefault();
            e.stopPropagation();

            moveSortableToTarget(src, $(e.target));
        });

        // dragend: show current element and delete placeholder
        self.$el.on('dragend', '[draggable]', function(e) {
            e.preventDefault();
            e.stopPropagation();

            src.$el.show();
            placeholder.drop();

            src = placeholder = null;

            self.$el.find('.rule-container, .rules-group-container').removeAttr('draggable');
        });
    });

    /**
     * Remove drag handle from non-sortable rules
     */
    this.on('parseRuleFlags.filter', function(flags) {
        if (flags.value.no_sortable === undefined) {
            flags.value.no_sortable = options.default_no_sortable;
        }
    });

    this.on('afterApplyRuleFlags', function(e, rule) {
        if (rule.flags.no_sortable) {
            rule.$el.find('.drag-handle').remove();
        }
    });

    /**
     * Modify templates
     */
    this.on('getGroupTemplate.filter', function(h, level) {
        if (level>1) {
            var $h = $(h.value);
            $h.find('.group-conditions').after('<div class="drag-handle"><i class="' + options.icon + '"></i></div>');
            h.value = $h.prop('outerHTML');
        }
    });

    this.on('getRuleTemplate.filter', function(h) {
        var $h = $(h.value);
        $h.find('.rule-header').after('<div class="drag-handle"><i class="' + options.icon + '"></i></div>');
        h.value = $h.prop('outerHTML');
    });
}, {
    default_no_sortable: false,
    icon: 'glyphicon glyphicon-sort'
});

/**
 * Move an element (placeholder or actual object) depending on active target
 * @param {Node}
 * @param {jQuery}
 */
function moveSortableToTarget(element, target) {
    var parent;

    // on rule
    parent = target.closest('.rule-container');
    if (parent.length) {
        element.moveAfter(Model(parent));
        return;
    }

    // on group header
    parent = target.closest('.rules-group-header');
    if (parent.length) {
        parent = target.closest('.rules-group-container');
        element.moveAtBegin(Model(parent));
        return;
    }

    // on group
    parent = target.closest('.rules-group-container');
    if (parent.length) {
        element.moveAtEnd(Model(parent));
        return;
    }
}

QueryBuilder.extend({
    updateDisabledFilters: function(e) {
        var self = e.builder;
        self.status.used_filters = {};

        if (!self.model) {
            return;
        }

        // get used filters
        (function walk(group) {
            group.each(function(rule) {
                if (rule.filter && rule.filter.unique) {
                    if (!self.status.used_filters[rule.filter.id]) {
                        self.status.used_filters[rule.filter.id] = [];
                    }
                    if (rule.filter.unique == 'group') {
                        self.status.used_filters[rule.filter.id].push(rule.parent);
                    }
                }
            }, function(group) {
                walk(group);
            });
        }(self.model.root));

        self.applyDisabledFilters(e);
    },

    applyDisabledFilters: function(e) {
        var self = e.builder;

        // re-enable everything
        self.$el.find('.rule-filter-container option').prop('disabled', false);

        // disable some
        $.each(self.status.used_filters, function(filterId, groups) {
            if (groups.length === 0) {
                self.$el.find('.rule-filter-container option[value=' + filterId + ']:not(:selected)').prop('disabled', true);
            }
            else {
                groups.forEach(function(group) {
                    group.each(function(rule) {
                        rule.$el.find('.rule-filter-container option[value=' + filterId + ']:not(:selected)').prop('disabled', true);
                    });
                });
            }
        });

        // update Selectpicker
        if (self.settings.plugins && self.settings.plugins['bt-selectpicker']) {
            self.$el.find('.rule-filter-container select').selectpicker('render');
        }
    }
});
}));