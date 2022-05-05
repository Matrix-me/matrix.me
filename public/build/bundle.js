
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_options(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            option.selected = ~value.indexOf(option.__value);
        }
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash$2(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash$2(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
        return context;
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.48.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    function isObject(value) {
      const type = typeof value;
      return value != null && (type == 'object' || type == 'function');
    }

    function getColumnSizeClass(isXs, colWidth, colSize) {
      if (colSize === true || colSize === '') {
        return isXs ? 'col' : `col-${colWidth}`;
      } else if (colSize === 'auto') {
        return isXs ? 'col-auto' : `col-${colWidth}-auto`;
      }

      return isXs ? `col-${colSize}` : `col-${colWidth}-${colSize}`;
    }

    function toClassName(value) {
      let result = '';

      if (typeof value === 'string' || typeof value === 'number') {
        result += value;
      } else if (typeof value === 'object') {
        if (Array.isArray(value)) {
          result = value.map(toClassName).filter(Boolean).join(' ');
        } else {
          for (let key in value) {
            if (value[key]) {
              result && (result += ' ');
              result += key;
            }
          }
        }
      }

      return result;
    }

    function classnames(...args) {
      return args.map(toClassName).filter(Boolean).join(' ');
    }

    function getTransitionDuration(element) {
      if (!element) return 0;

      // Get transition-duration of the element
      let { transitionDuration, transitionDelay } =
        window.getComputedStyle(element);

      const floatTransitionDuration = Number.parseFloat(transitionDuration);
      const floatTransitionDelay = Number.parseFloat(transitionDelay);

      // Return 0 if element or transition duration is not found
      if (!floatTransitionDuration && !floatTransitionDelay) {
        return 0;
      }

      // If multiple durations are defined, take the first
      transitionDuration = transitionDuration.split(',')[0];
      transitionDelay = transitionDelay.split(',')[0];

      return (
        (Number.parseFloat(transitionDuration) +
          Number.parseFloat(transitionDelay)) *
        1000
      );
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    function collapseOut(node, params) {
      const dimension = params.horizontal ? 'width' : 'height';
      node.style[dimension] = `${node.getBoundingClientRect()[dimension]}px`;
      node.classList.add('collapsing');
      node.classList.remove('collapse', 'show');
      const duration = getTransitionDuration(node);

      return {
        duration,
        tick: (t) => {
          if (t > 0) {
            node.style[dimension] = '';
          } else if (t === 0) {
            node.classList.remove('collapsing');
            node.classList.add('collapse');
          }
        }
      };
    }

    function collapseIn(node, params) {
      const horizontal = params.horizontal;
      const dimension = horizontal ? 'width' : 'height';
      node.classList.add('collapsing');
      node.classList.remove('collapse', 'show');
      node.style[dimension] = 0;
      const duration = getTransitionDuration(node);

      return {
        duration,
        tick: (t) => {
          if (t < 1) {
            if (horizontal) {
              node.style.width = `${node.scrollWidth}px`;
            } else {
              node.style.height = `${node.scrollHeight}px`;
            }
          } else {
            node.classList.remove('collapsing');
            node.classList.add('collapse', 'show');
            node.style[dimension] = '';
          }
        }
      };
    }

    const defaultToggleEvents = ['touchstart', 'click'];

    var toggle = (toggler, togglerFn) => {
      let unbindEvents;

      if (
        typeof toggler === 'string' &&
        typeof window !== 'undefined' &&
        document &&
        document.createElement
      ) {
        let selection = document.querySelectorAll(toggler);
        if (!selection.length) {
          selection = document.querySelectorAll(`#${toggler}`);
        }
        if (!selection.length) {
          throw new Error(
            `The target '${toggler}' could not be identified in the dom, tip: check spelling`
          );
        }

        defaultToggleEvents.forEach((event) => {
          selection.forEach((element) => {
            element.addEventListener(event, togglerFn);
          });
        });

        unbindEvents = () => {
          defaultToggleEvents.forEach((event) => {
            selection.forEach((element) => {
              element.removeEventListener(event, togglerFn);
            });
          });
        };
      }

      return () => {
        if (typeof unbindEvents === 'function') {
          unbindEvents();
          unbindEvents = undefined;
        }
      };
    };

    /* node_modules/sveltestrap/src/Collapse.svelte generated by Svelte v3.48.0 */
    const file$k = "node_modules/sveltestrap/src/Collapse.svelte";

    // (61:0) {#if isOpen}
    function create_if_block$7(ctx) {
    	let div;
    	let div_style_value;
    	let div_intro;
    	let div_outro;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[16].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[15], null);

    	let div_levels = [
    		{
    			style: div_style_value = /*navbar*/ ctx[2] ? undefined : 'overflow: hidden;'
    		},
    		/*$$restProps*/ ctx[9],
    		{ class: /*classes*/ ctx[8] }
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$k, 61, 2, 1551);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "introstart", /*introstart_handler*/ ctx[17], false, false, false),
    					listen_dev(div, "introend", /*introend_handler*/ ctx[18], false, false, false),
    					listen_dev(div, "outrostart", /*outrostart_handler*/ ctx[19], false, false, false),
    					listen_dev(div, "outroend", /*outroend_handler*/ ctx[20], false, false, false),
    					listen_dev(
    						div,
    						"introstart",
    						function () {
    							if (is_function(/*onEntering*/ ctx[3])) /*onEntering*/ ctx[3].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						div,
    						"introend",
    						function () {
    							if (is_function(/*onEntered*/ ctx[4])) /*onEntered*/ ctx[4].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						div,
    						"outrostart",
    						function () {
    							if (is_function(/*onExiting*/ ctx[5])) /*onExiting*/ ctx[5].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						div,
    						"outroend",
    						function () {
    							if (is_function(/*onExited*/ ctx[6])) /*onExited*/ ctx[6].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32768)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[15],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[15])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[15], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				(!current || dirty & /*navbar*/ 4 && div_style_value !== (div_style_value = /*navbar*/ ctx[2] ? undefined : 'overflow: hidden;')) && { style: div_style_value },
    				dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9],
    				(!current || dirty & /*classes*/ 256) && { class: /*classes*/ ctx[8] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);

    			add_render_callback(() => {
    				if (div_outro) div_outro.end(1);
    				div_intro = create_in_transition(div, collapseIn, { horizontal: /*horizontal*/ ctx[1] });
    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			if (div_intro) div_intro.invalidate();

    			if (local) {
    				div_outro = create_out_transition(div, collapseOut, { horizontal: /*horizontal*/ ctx[1] });
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching && div_outro) div_outro.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(61:0) {#if isOpen}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$n(ctx) {
    	let if_block_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowresize*/ ctx[21]);
    	let if_block = /*isOpen*/ ctx[0] && create_if_block$7(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window, "resize", /*onwindowresize*/ ctx[21]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*isOpen*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isOpen*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$7(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let classes;

    	const omit_props_names = [
    		"isOpen","class","horizontal","navbar","onEntering","onEntered","onExiting","onExited","expand","toggler"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Collapse', slots, ['default']);
    	const dispatch = createEventDispatcher();
    	let { isOpen = false } = $$props;
    	let { class: className = '' } = $$props;
    	let { horizontal = false } = $$props;
    	let { navbar = false } = $$props;
    	let { onEntering = () => dispatch('opening') } = $$props;
    	let { onEntered = () => dispatch('open') } = $$props;
    	let { onExiting = () => dispatch('closing') } = $$props;
    	let { onExited = () => dispatch('close') } = $$props;
    	let { expand = false } = $$props;
    	let { toggler = null } = $$props;

    	onMount(() => toggle(toggler, e => {
    		$$invalidate(0, isOpen = !isOpen);
    		e.preventDefault();
    	}));

    	let windowWidth = 0;
    	let _wasMaximized = false;

    	// TODO wrong to hardcode these here - come from Bootstrap CSS only
    	const minWidth = {};

    	minWidth['xs'] = 0;
    	minWidth['sm'] = 576;
    	minWidth['md'] = 768;
    	minWidth['lg'] = 992;
    	minWidth['xl'] = 1200;

    	function notify() {
    		dispatch('update', isOpen);
    	}

    	function introstart_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function introend_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function outrostart_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function outroend_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function onwindowresize() {
    		$$invalidate(7, windowWidth = window.innerWidth);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(9, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('isOpen' in $$new_props) $$invalidate(0, isOpen = $$new_props.isOpen);
    		if ('class' in $$new_props) $$invalidate(10, className = $$new_props.class);
    		if ('horizontal' in $$new_props) $$invalidate(1, horizontal = $$new_props.horizontal);
    		if ('navbar' in $$new_props) $$invalidate(2, navbar = $$new_props.navbar);
    		if ('onEntering' in $$new_props) $$invalidate(3, onEntering = $$new_props.onEntering);
    		if ('onEntered' in $$new_props) $$invalidate(4, onEntered = $$new_props.onEntered);
    		if ('onExiting' in $$new_props) $$invalidate(5, onExiting = $$new_props.onExiting);
    		if ('onExited' in $$new_props) $$invalidate(6, onExited = $$new_props.onExited);
    		if ('expand' in $$new_props) $$invalidate(11, expand = $$new_props.expand);
    		if ('toggler' in $$new_props) $$invalidate(12, toggler = $$new_props.toggler);
    		if ('$$scope' in $$new_props) $$invalidate(15, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		onMount,
    		collapseIn,
    		collapseOut,
    		classnames,
    		toggle,
    		dispatch,
    		isOpen,
    		className,
    		horizontal,
    		navbar,
    		onEntering,
    		onEntered,
    		onExiting,
    		onExited,
    		expand,
    		toggler,
    		windowWidth,
    		_wasMaximized,
    		minWidth,
    		notify,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('isOpen' in $$props) $$invalidate(0, isOpen = $$new_props.isOpen);
    		if ('className' in $$props) $$invalidate(10, className = $$new_props.className);
    		if ('horizontal' in $$props) $$invalidate(1, horizontal = $$new_props.horizontal);
    		if ('navbar' in $$props) $$invalidate(2, navbar = $$new_props.navbar);
    		if ('onEntering' in $$props) $$invalidate(3, onEntering = $$new_props.onEntering);
    		if ('onEntered' in $$props) $$invalidate(4, onEntered = $$new_props.onEntered);
    		if ('onExiting' in $$props) $$invalidate(5, onExiting = $$new_props.onExiting);
    		if ('onExited' in $$props) $$invalidate(6, onExited = $$new_props.onExited);
    		if ('expand' in $$props) $$invalidate(11, expand = $$new_props.expand);
    		if ('toggler' in $$props) $$invalidate(12, toggler = $$new_props.toggler);
    		if ('windowWidth' in $$props) $$invalidate(7, windowWidth = $$new_props.windowWidth);
    		if ('_wasMaximized' in $$props) $$invalidate(13, _wasMaximized = $$new_props._wasMaximized);
    		if ('classes' in $$props) $$invalidate(8, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, horizontal, navbar*/ 1030) {
    			$$invalidate(8, classes = classnames(className, {
    				'collapse-horizontal': horizontal,
    				'navbar-collapse': navbar
    			}));
    		}

    		if ($$self.$$.dirty & /*navbar, expand, windowWidth, minWidth, isOpen, _wasMaximized*/ 26757) {
    			if (navbar && expand) {
    				if (windowWidth >= minWidth[expand] && !isOpen) {
    					$$invalidate(0, isOpen = true);
    					$$invalidate(13, _wasMaximized = true);
    					notify();
    				} else if (windowWidth < minWidth[expand] && _wasMaximized) {
    					$$invalidate(0, isOpen = false);
    					$$invalidate(13, _wasMaximized = false);
    					notify();
    				}
    			}
    		}
    	};

    	return [
    		isOpen,
    		horizontal,
    		navbar,
    		onEntering,
    		onEntered,
    		onExiting,
    		onExited,
    		windowWidth,
    		classes,
    		$$restProps,
    		className,
    		expand,
    		toggler,
    		_wasMaximized,
    		minWidth,
    		$$scope,
    		slots,
    		introstart_handler,
    		introend_handler,
    		outrostart_handler,
    		outroend_handler,
    		onwindowresize
    	];
    }

    class Collapse extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$n, create_fragment$n, safe_not_equal, {
    			isOpen: 0,
    			class: 10,
    			horizontal: 1,
    			navbar: 2,
    			onEntering: 3,
    			onEntered: 4,
    			onExiting: 5,
    			onExited: 6,
    			expand: 11,
    			toggler: 12
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Collapse",
    			options,
    			id: create_fragment$n.name
    		});
    	}

    	get isOpen() {
    		throw new Error("<Collapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isOpen(value) {
    		throw new Error("<Collapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Collapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Collapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get horizontal() {
    		throw new Error("<Collapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set horizontal(value) {
    		throw new Error("<Collapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get navbar() {
    		throw new Error("<Collapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set navbar(value) {
    		throw new Error("<Collapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onEntering() {
    		throw new Error("<Collapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onEntering(value) {
    		throw new Error("<Collapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onEntered() {
    		throw new Error("<Collapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onEntered(value) {
    		throw new Error("<Collapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onExiting() {
    		throw new Error("<Collapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onExiting(value) {
    		throw new Error("<Collapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onExited() {
    		throw new Error("<Collapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onExited(value) {
    		throw new Error("<Collapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get expand() {
    		throw new Error("<Collapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set expand(value) {
    		throw new Error("<Collapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get toggler() {
    		throw new Error("<Collapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set toggler(value) {
    		throw new Error("<Collapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/Button.svelte generated by Svelte v3.48.0 */
    const file$j = "node_modules/sveltestrap/src/Button.svelte";

    // (54:0) {:else}
    function create_else_block_1$1(ctx) {
    	let button;
    	let button_aria_label_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);
    	const default_slot_or_fallback = default_slot || fallback_block$3(ctx);

    	let button_levels = [
    		/*$$restProps*/ ctx[9],
    		{ class: /*classes*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[2] },
    		{ value: /*value*/ ctx[5] },
    		{
    			"aria-label": button_aria_label_value = /*ariaLabel*/ ctx[8] || /*defaultAriaLabel*/ ctx[6]
    		},
    		{ style: /*style*/ ctx[4] }
    	];

    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block_1 = {
    		c: function create() {
    			button = element("button");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			set_attributes(button, button_data);
    			add_location(button, file$j, 54, 2, 1124);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(button, null);
    			}

    			if (button.autofocus) button.focus();
    			/*button_binding*/ ctx[23](button);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[21], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 262144)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, null),
    						null
    					);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*children, $$scope*/ 262146)) {
    					default_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			set_attributes(button, button_data = get_spread_update(button_levels, [
    				dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9],
    				(!current || dirty & /*classes*/ 128) && { class: /*classes*/ ctx[7] },
    				(!current || dirty & /*disabled*/ 4) && { disabled: /*disabled*/ ctx[2] },
    				(!current || dirty & /*value*/ 32) && { value: /*value*/ ctx[5] },
    				(!current || dirty & /*ariaLabel, defaultAriaLabel*/ 320 && button_aria_label_value !== (button_aria_label_value = /*ariaLabel*/ ctx[8] || /*defaultAriaLabel*/ ctx[6])) && { "aria-label": button_aria_label_value },
    				(!current || dirty & /*style*/ 16) && { style: /*style*/ ctx[4] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			/*button_binding*/ ctx[23](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_else_block_1$1.name,
    		type: "else",
    		source: "(54:0) {:else}",
    		ctx
    	});

    	return block_1;
    }

    // (37:0) {#if href}
    function create_if_block$6(ctx) {
    	let a;
    	let current_block_type_index;
    	let if_block;
    	let a_aria_label_value;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block_1$4, create_else_block$6];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*children*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	let a_levels = [
    		/*$$restProps*/ ctx[9],
    		{ class: /*classes*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[2] },
    		{ href: /*href*/ ctx[3] },
    		{
    			"aria-label": a_aria_label_value = /*ariaLabel*/ ctx[8] || /*defaultAriaLabel*/ ctx[6]
    		},
    		{ style: /*style*/ ctx[4] }
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block_1 = {
    		c: function create() {
    			a = element("a");
    			if_block.c();
    			set_attributes(a, a_data);
    			add_location(a, file$j, 37, 2, 866);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			if_blocks[current_block_type_index].m(a, null);
    			/*a_binding*/ ctx[22](a);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*click_handler*/ ctx[20], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(a, null);
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9],
    				(!current || dirty & /*classes*/ 128) && { class: /*classes*/ ctx[7] },
    				(!current || dirty & /*disabled*/ 4) && { disabled: /*disabled*/ ctx[2] },
    				(!current || dirty & /*href*/ 8) && { href: /*href*/ ctx[3] },
    				(!current || dirty & /*ariaLabel, defaultAriaLabel*/ 320 && a_aria_label_value !== (a_aria_label_value = /*ariaLabel*/ ctx[8] || /*defaultAriaLabel*/ ctx[6])) && { "aria-label": a_aria_label_value },
    				(!current || dirty & /*style*/ 16) && { style: /*style*/ ctx[4] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if_blocks[current_block_type_index].d();
    			/*a_binding*/ ctx[22](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(37:0) {#if href}",
    		ctx
    	});

    	return block_1;
    }

    // (68:6) {:else}
    function create_else_block_2(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);

    	const block_1 = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 262144)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(68:6) {:else}",
    		ctx
    	});

    	return block_1;
    }

    // (66:6) {#if children}
    function create_if_block_2$4(ctx) {
    	let t;

    	const block_1 = {
    		c: function create() {
    			t = text(/*children*/ ctx[1]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*children*/ 2) set_data_dev(t, /*children*/ ctx[1]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_2$4.name,
    		type: "if",
    		source: "(66:6) {#if children}",
    		ctx
    	});

    	return block_1;
    }

    // (65:10)        
    function fallback_block$3(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_2$4, create_else_block_2];
    	const if_blocks = [];

    	function select_block_type_2(ctx, dirty) {
    		if (/*children*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_2(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block_1 = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_2(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: fallback_block$3.name,
    		type: "fallback",
    		source: "(65:10)        ",
    		ctx
    	});

    	return block_1;
    }

    // (50:4) {:else}
    function create_else_block$6(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);

    	const block_1 = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 262144)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_else_block$6.name,
    		type: "else",
    		source: "(50:4) {:else}",
    		ctx
    	});

    	return block_1;
    }

    // (48:4) {#if children}
    function create_if_block_1$4(ctx) {
    	let t;

    	const block_1 = {
    		c: function create() {
    			t = text(/*children*/ ctx[1]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*children*/ 2) set_data_dev(t, /*children*/ ctx[1]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(48:4) {#if children}",
    		ctx
    	});

    	return block_1;
    }

    function create_fragment$m(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$6, create_else_block_1$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*href*/ ctx[3]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block_1 = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block_1;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let ariaLabel;
    	let classes;
    	let defaultAriaLabel;

    	const omit_props_names = [
    		"class","active","block","children","close","color","disabled","href","inner","outline","size","style","value","white"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, ['default']);
    	let { class: className = '' } = $$props;
    	let { active = false } = $$props;
    	let { block = false } = $$props;
    	let { children = undefined } = $$props;
    	let { close = false } = $$props;
    	let { color = 'secondary' } = $$props;
    	let { disabled = false } = $$props;
    	let { href = '' } = $$props;
    	let { inner = undefined } = $$props;
    	let { outline = false } = $$props;
    	let { size = null } = $$props;
    	let { style = '' } = $$props;
    	let { value = '' } = $$props;
    	let { white = false } = $$props;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function a_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(0, inner);
    		});
    	}

    	function button_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(0, inner);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(24, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(9, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(10, className = $$new_props.class);
    		if ('active' in $$new_props) $$invalidate(11, active = $$new_props.active);
    		if ('block' in $$new_props) $$invalidate(12, block = $$new_props.block);
    		if ('children' in $$new_props) $$invalidate(1, children = $$new_props.children);
    		if ('close' in $$new_props) $$invalidate(13, close = $$new_props.close);
    		if ('color' in $$new_props) $$invalidate(14, color = $$new_props.color);
    		if ('disabled' in $$new_props) $$invalidate(2, disabled = $$new_props.disabled);
    		if ('href' in $$new_props) $$invalidate(3, href = $$new_props.href);
    		if ('inner' in $$new_props) $$invalidate(0, inner = $$new_props.inner);
    		if ('outline' in $$new_props) $$invalidate(15, outline = $$new_props.outline);
    		if ('size' in $$new_props) $$invalidate(16, size = $$new_props.size);
    		if ('style' in $$new_props) $$invalidate(4, style = $$new_props.style);
    		if ('value' in $$new_props) $$invalidate(5, value = $$new_props.value);
    		if ('white' in $$new_props) $$invalidate(17, white = $$new_props.white);
    		if ('$$scope' in $$new_props) $$invalidate(18, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		active,
    		block,
    		children,
    		close,
    		color,
    		disabled,
    		href,
    		inner,
    		outline,
    		size,
    		style,
    		value,
    		white,
    		defaultAriaLabel,
    		classes,
    		ariaLabel
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(24, $$props = assign(assign({}, $$props), $$new_props));
    		if ('className' in $$props) $$invalidate(10, className = $$new_props.className);
    		if ('active' in $$props) $$invalidate(11, active = $$new_props.active);
    		if ('block' in $$props) $$invalidate(12, block = $$new_props.block);
    		if ('children' in $$props) $$invalidate(1, children = $$new_props.children);
    		if ('close' in $$props) $$invalidate(13, close = $$new_props.close);
    		if ('color' in $$props) $$invalidate(14, color = $$new_props.color);
    		if ('disabled' in $$props) $$invalidate(2, disabled = $$new_props.disabled);
    		if ('href' in $$props) $$invalidate(3, href = $$new_props.href);
    		if ('inner' in $$props) $$invalidate(0, inner = $$new_props.inner);
    		if ('outline' in $$props) $$invalidate(15, outline = $$new_props.outline);
    		if ('size' in $$props) $$invalidate(16, size = $$new_props.size);
    		if ('style' in $$props) $$invalidate(4, style = $$new_props.style);
    		if ('value' in $$props) $$invalidate(5, value = $$new_props.value);
    		if ('white' in $$props) $$invalidate(17, white = $$new_props.white);
    		if ('defaultAriaLabel' in $$props) $$invalidate(6, defaultAriaLabel = $$new_props.defaultAriaLabel);
    		if ('classes' in $$props) $$invalidate(7, classes = $$new_props.classes);
    		if ('ariaLabel' in $$props) $$invalidate(8, ariaLabel = $$new_props.ariaLabel);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(8, ariaLabel = $$props['aria-label']);

    		if ($$self.$$.dirty & /*className, close, outline, color, size, block, active, white*/ 261120) {
    			$$invalidate(7, classes = classnames(className, close ? 'btn-close' : 'btn', close || `btn${outline ? '-outline' : ''}-${color}`, size ? `btn-${size}` : false, block ? 'd-block w-100' : false, {
    				active,
    				'btn-close-white': close && white
    			}));
    		}

    		if ($$self.$$.dirty & /*close*/ 8192) {
    			$$invalidate(6, defaultAriaLabel = close ? 'Close' : null);
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		inner,
    		children,
    		disabled,
    		href,
    		style,
    		value,
    		defaultAriaLabel,
    		classes,
    		ariaLabel,
    		$$restProps,
    		className,
    		active,
    		block,
    		close,
    		color,
    		outline,
    		size,
    		white,
    		$$scope,
    		slots,
    		click_handler,
    		click_handler_1,
    		a_binding,
    		button_binding
    	];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {
    			class: 10,
    			active: 11,
    			block: 12,
    			children: 1,
    			close: 13,
    			color: 14,
    			disabled: 2,
    			href: 3,
    			inner: 0,
    			outline: 15,
    			size: 16,
    			style: 4,
    			value: 5,
    			white: 17
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$m.name
    		});
    	}

    	get class() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get block() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set block(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get children() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set children(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get close() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set close(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inner() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inner(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outline() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outline(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get white() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set white(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function getWindow(node) {
      if (node == null) {
        return window;
      }

      if (node.toString() !== '[object Window]') {
        var ownerDocument = node.ownerDocument;
        return ownerDocument ? ownerDocument.defaultView || window : window;
      }

      return node;
    }

    function isElement(node) {
      var OwnElement = getWindow(node).Element;
      return node instanceof OwnElement || node instanceof Element;
    }

    function isHTMLElement(node) {
      var OwnElement = getWindow(node).HTMLElement;
      return node instanceof OwnElement || node instanceof HTMLElement;
    }

    function isShadowRoot(node) {
      // IE 11 has no ShadowRoot
      if (typeof ShadowRoot === 'undefined') {
        return false;
      }

      var OwnElement = getWindow(node).ShadowRoot;
      return node instanceof OwnElement || node instanceof ShadowRoot;
    }

    var max = Math.max;
    var min = Math.min;
    var round = Math.round;

    function getBoundingClientRect(element, includeScale) {
      if (includeScale === void 0) {
        includeScale = false;
      }

      var rect = element.getBoundingClientRect();
      var scaleX = 1;
      var scaleY = 1;

      if (isHTMLElement(element) && includeScale) {
        var offsetHeight = element.offsetHeight;
        var offsetWidth = element.offsetWidth; // Do not attempt to divide by 0, otherwise we get `Infinity` as scale
        // Fallback to 1 in case both values are `0`

        if (offsetWidth > 0) {
          scaleX = round(rect.width) / offsetWidth || 1;
        }

        if (offsetHeight > 0) {
          scaleY = round(rect.height) / offsetHeight || 1;
        }
      }

      return {
        width: rect.width / scaleX,
        height: rect.height / scaleY,
        top: rect.top / scaleY,
        right: rect.right / scaleX,
        bottom: rect.bottom / scaleY,
        left: rect.left / scaleX,
        x: rect.left / scaleX,
        y: rect.top / scaleY
      };
    }

    function getWindowScroll(node) {
      var win = getWindow(node);
      var scrollLeft = win.pageXOffset;
      var scrollTop = win.pageYOffset;
      return {
        scrollLeft: scrollLeft,
        scrollTop: scrollTop
      };
    }

    function getHTMLElementScroll(element) {
      return {
        scrollLeft: element.scrollLeft,
        scrollTop: element.scrollTop
      };
    }

    function getNodeScroll(node) {
      if (node === getWindow(node) || !isHTMLElement(node)) {
        return getWindowScroll(node);
      } else {
        return getHTMLElementScroll(node);
      }
    }

    function getNodeName(element) {
      return element ? (element.nodeName || '').toLowerCase() : null;
    }

    function getDocumentElement(element) {
      // $FlowFixMe[incompatible-return]: assume body is always available
      return ((isElement(element) ? element.ownerDocument : // $FlowFixMe[prop-missing]
      element.document) || window.document).documentElement;
    }

    function getWindowScrollBarX(element) {
      // If <html> has a CSS width greater than the viewport, then this will be
      // incorrect for RTL.
      // Popper 1 is broken in this case and never had a bug report so let's assume
      // it's not an issue. I don't think anyone ever specifies width on <html>
      // anyway.
      // Browsers where the left scrollbar doesn't cause an issue report `0` for
      // this (e.g. Edge 2019, IE11, Safari)
      return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
    }

    function getComputedStyle(element) {
      return getWindow(element).getComputedStyle(element);
    }

    function isScrollParent(element) {
      // Firefox wants us to check `-x` and `-y` variations as well
      var _getComputedStyle = getComputedStyle(element),
          overflow = _getComputedStyle.overflow,
          overflowX = _getComputedStyle.overflowX,
          overflowY = _getComputedStyle.overflowY;

      return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
    }

    function isElementScaled(element) {
      var rect = element.getBoundingClientRect();
      var scaleX = round(rect.width) / element.offsetWidth || 1;
      var scaleY = round(rect.height) / element.offsetHeight || 1;
      return scaleX !== 1 || scaleY !== 1;
    } // Returns the composite rect of an element relative to its offsetParent.
    // Composite means it takes into account transforms as well as layout.


    function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
      if (isFixed === void 0) {
        isFixed = false;
      }

      var isOffsetParentAnElement = isHTMLElement(offsetParent);
      var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
      var documentElement = getDocumentElement(offsetParent);
      var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled);
      var scroll = {
        scrollLeft: 0,
        scrollTop: 0
      };
      var offsets = {
        x: 0,
        y: 0
      };

      if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
        if (getNodeName(offsetParent) !== 'body' || // https://github.com/popperjs/popper-core/issues/1078
        isScrollParent(documentElement)) {
          scroll = getNodeScroll(offsetParent);
        }

        if (isHTMLElement(offsetParent)) {
          offsets = getBoundingClientRect(offsetParent, true);
          offsets.x += offsetParent.clientLeft;
          offsets.y += offsetParent.clientTop;
        } else if (documentElement) {
          offsets.x = getWindowScrollBarX(documentElement);
        }
      }

      return {
        x: rect.left + scroll.scrollLeft - offsets.x,
        y: rect.top + scroll.scrollTop - offsets.y,
        width: rect.width,
        height: rect.height
      };
    }

    // means it doesn't take into account transforms.

    function getLayoutRect(element) {
      var clientRect = getBoundingClientRect(element); // Use the clientRect sizes if it's not been transformed.
      // Fixes https://github.com/popperjs/popper-core/issues/1223

      var width = element.offsetWidth;
      var height = element.offsetHeight;

      if (Math.abs(clientRect.width - width) <= 1) {
        width = clientRect.width;
      }

      if (Math.abs(clientRect.height - height) <= 1) {
        height = clientRect.height;
      }

      return {
        x: element.offsetLeft,
        y: element.offsetTop,
        width: width,
        height: height
      };
    }

    function getParentNode(element) {
      if (getNodeName(element) === 'html') {
        return element;
      }

      return (// this is a quicker (but less type safe) way to save quite some bytes from the bundle
        // $FlowFixMe[incompatible-return]
        // $FlowFixMe[prop-missing]
        element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
        element.parentNode || ( // DOM Element detected
        isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
        // $FlowFixMe[incompatible-call]: HTMLElement is a Node
        getDocumentElement(element) // fallback

      );
    }

    function getScrollParent(node) {
      if (['html', 'body', '#document'].indexOf(getNodeName(node)) >= 0) {
        // $FlowFixMe[incompatible-return]: assume body is always available
        return node.ownerDocument.body;
      }

      if (isHTMLElement(node) && isScrollParent(node)) {
        return node;
      }

      return getScrollParent(getParentNode(node));
    }

    /*
    given a DOM element, return the list of all scroll parents, up the list of ancesors
    until we get to the top window object. This list is what we attach scroll listeners
    to, because if any of these parent elements scroll, we'll need to re-calculate the
    reference element's position.
    */

    function listScrollParents(element, list) {
      var _element$ownerDocumen;

      if (list === void 0) {
        list = [];
      }

      var scrollParent = getScrollParent(element);
      var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
      var win = getWindow(scrollParent);
      var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
      var updatedList = list.concat(target);
      return isBody ? updatedList : // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
      updatedList.concat(listScrollParents(getParentNode(target)));
    }

    function isTableElement(element) {
      return ['table', 'td', 'th'].indexOf(getNodeName(element)) >= 0;
    }

    function getTrueOffsetParent(element) {
      if (!isHTMLElement(element) || // https://github.com/popperjs/popper-core/issues/837
      getComputedStyle(element).position === 'fixed') {
        return null;
      }

      return element.offsetParent;
    } // `.offsetParent` reports `null` for fixed elements, while absolute elements
    // return the containing block


    function getContainingBlock(element) {
      var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') !== -1;
      var isIE = navigator.userAgent.indexOf('Trident') !== -1;

      if (isIE && isHTMLElement(element)) {
        // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
        var elementCss = getComputedStyle(element);

        if (elementCss.position === 'fixed') {
          return null;
        }
      }

      var currentNode = getParentNode(element);

      if (isShadowRoot(currentNode)) {
        currentNode = currentNode.host;
      }

      while (isHTMLElement(currentNode) && ['html', 'body'].indexOf(getNodeName(currentNode)) < 0) {
        var css = getComputedStyle(currentNode); // This is non-exhaustive but covers the most common CSS properties that
        // create a containing block.
        // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

        if (css.transform !== 'none' || css.perspective !== 'none' || css.contain === 'paint' || ['transform', 'perspective'].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === 'filter' || isFirefox && css.filter && css.filter !== 'none') {
          return currentNode;
        } else {
          currentNode = currentNode.parentNode;
        }
      }

      return null;
    } // Gets the closest ancestor positioned element. Handles some edge cases,
    // such as table ancestors and cross browser bugs.


    function getOffsetParent(element) {
      var window = getWindow(element);
      var offsetParent = getTrueOffsetParent(element);

      while (offsetParent && isTableElement(offsetParent) && getComputedStyle(offsetParent).position === 'static') {
        offsetParent = getTrueOffsetParent(offsetParent);
      }

      if (offsetParent && (getNodeName(offsetParent) === 'html' || getNodeName(offsetParent) === 'body' && getComputedStyle(offsetParent).position === 'static')) {
        return window;
      }

      return offsetParent || getContainingBlock(element) || window;
    }

    var top = 'top';
    var bottom = 'bottom';
    var right = 'right';
    var left = 'left';
    var auto = 'auto';
    var basePlacements = [top, bottom, right, left];
    var start = 'start';
    var end = 'end';
    var clippingParents = 'clippingParents';
    var viewport = 'viewport';
    var popper = 'popper';
    var reference = 'reference';
    var variationPlacements = /*#__PURE__*/basePlacements.reduce(function (acc, placement) {
      return acc.concat([placement + "-" + start, placement + "-" + end]);
    }, []);
    var placements = /*#__PURE__*/[].concat(basePlacements, [auto]).reduce(function (acc, placement) {
      return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
    }, []); // modifiers that need to read the DOM

    var beforeRead = 'beforeRead';
    var read = 'read';
    var afterRead = 'afterRead'; // pure-logic modifiers

    var beforeMain = 'beforeMain';
    var main = 'main';
    var afterMain = 'afterMain'; // modifier with the purpose to write to the DOM (or write into a framework state)

    var beforeWrite = 'beforeWrite';
    var write = 'write';
    var afterWrite = 'afterWrite';
    var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

    function order(modifiers) {
      var map = new Map();
      var visited = new Set();
      var result = [];
      modifiers.forEach(function (modifier) {
        map.set(modifier.name, modifier);
      }); // On visiting object, check for its dependencies and visit them recursively

      function sort(modifier) {
        visited.add(modifier.name);
        var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
        requires.forEach(function (dep) {
          if (!visited.has(dep)) {
            var depModifier = map.get(dep);

            if (depModifier) {
              sort(depModifier);
            }
          }
        });
        result.push(modifier);
      }

      modifiers.forEach(function (modifier) {
        if (!visited.has(modifier.name)) {
          // check for visited object
          sort(modifier);
        }
      });
      return result;
    }

    function orderModifiers(modifiers) {
      // order based on dependencies
      var orderedModifiers = order(modifiers); // order based on phase

      return modifierPhases.reduce(function (acc, phase) {
        return acc.concat(orderedModifiers.filter(function (modifier) {
          return modifier.phase === phase;
        }));
      }, []);
    }

    function debounce(fn) {
      var pending;
      return function () {
        if (!pending) {
          pending = new Promise(function (resolve) {
            Promise.resolve().then(function () {
              pending = undefined;
              resolve(fn());
            });
          });
        }

        return pending;
      };
    }

    function getBasePlacement(placement) {
      return placement.split('-')[0];
    }

    function mergeByName(modifiers) {
      var merged = modifiers.reduce(function (merged, current) {
        var existing = merged[current.name];
        merged[current.name] = existing ? Object.assign({}, existing, current, {
          options: Object.assign({}, existing.options, current.options),
          data: Object.assign({}, existing.data, current.data)
        }) : current;
        return merged;
      }, {}); // IE11 does not support Object.values

      return Object.keys(merged).map(function (key) {
        return merged[key];
      });
    }

    function getViewportRect(element) {
      var win = getWindow(element);
      var html = getDocumentElement(element);
      var visualViewport = win.visualViewport;
      var width = html.clientWidth;
      var height = html.clientHeight;
      var x = 0;
      var y = 0; // NB: This isn't supported on iOS <= 12. If the keyboard is open, the popper
      // can be obscured underneath it.
      // Also, `html.clientHeight` adds the bottom bar height in Safari iOS, even
      // if it isn't open, so if this isn't available, the popper will be detected
      // to overflow the bottom of the screen too early.

      if (visualViewport) {
        width = visualViewport.width;
        height = visualViewport.height; // Uses Layout Viewport (like Chrome; Safari does not currently)
        // In Chrome, it returns a value very close to 0 (+/-) but contains rounding
        // errors due to floating point numbers, so we need to check precision.
        // Safari returns a number <= 0, usually < -1 when pinch-zoomed
        // Feature detection fails in mobile emulation mode in Chrome.
        // Math.abs(win.innerWidth / visualViewport.scale - visualViewport.width) <
        // 0.001
        // Fallback here: "Not Safari" userAgent

        if (!/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
          x = visualViewport.offsetLeft;
          y = visualViewport.offsetTop;
        }
      }

      return {
        width: width,
        height: height,
        x: x + getWindowScrollBarX(element),
        y: y
      };
    }

    // of the `<html>` and `<body>` rect bounds if horizontally scrollable

    function getDocumentRect(element) {
      var _element$ownerDocumen;

      var html = getDocumentElement(element);
      var winScroll = getWindowScroll(element);
      var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
      var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
      var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
      var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
      var y = -winScroll.scrollTop;

      if (getComputedStyle(body || html).direction === 'rtl') {
        x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
      }

      return {
        width: width,
        height: height,
        x: x,
        y: y
      };
    }

    function contains(parent, child) {
      var rootNode = child.getRootNode && child.getRootNode(); // First, attempt with faster native method

      if (parent.contains(child)) {
        return true;
      } // then fallback to custom implementation with Shadow DOM support
      else if (rootNode && isShadowRoot(rootNode)) {
          var next = child;

          do {
            if (next && parent.isSameNode(next)) {
              return true;
            } // $FlowFixMe[prop-missing]: need a better way to handle this...


            next = next.parentNode || next.host;
          } while (next);
        } // Give up, the result is false


      return false;
    }

    function rectToClientRect(rect) {
      return Object.assign({}, rect, {
        left: rect.x,
        top: rect.y,
        right: rect.x + rect.width,
        bottom: rect.y + rect.height
      });
    }

    function getInnerBoundingClientRect(element) {
      var rect = getBoundingClientRect(element);
      rect.top = rect.top + element.clientTop;
      rect.left = rect.left + element.clientLeft;
      rect.bottom = rect.top + element.clientHeight;
      rect.right = rect.left + element.clientWidth;
      rect.width = element.clientWidth;
      rect.height = element.clientHeight;
      rect.x = rect.left;
      rect.y = rect.top;
      return rect;
    }

    function getClientRectFromMixedType(element, clippingParent) {
      return clippingParent === viewport ? rectToClientRect(getViewportRect(element)) : isElement(clippingParent) ? getInnerBoundingClientRect(clippingParent) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
    } // A "clipping parent" is an overflowable container with the characteristic of
    // clipping (or hiding) overflowing elements with a position different from
    // `initial`


    function getClippingParents(element) {
      var clippingParents = listScrollParents(getParentNode(element));
      var canEscapeClipping = ['absolute', 'fixed'].indexOf(getComputedStyle(element).position) >= 0;
      var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;

      if (!isElement(clipperElement)) {
        return [];
      } // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414


      return clippingParents.filter(function (clippingParent) {
        return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== 'body';
      });
    } // Gets the maximum area that the element is visible in due to any number of
    // clipping parents


    function getClippingRect(element, boundary, rootBoundary) {
      var mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
      var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
      var firstClippingParent = clippingParents[0];
      var clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
        var rect = getClientRectFromMixedType(element, clippingParent);
        accRect.top = max(rect.top, accRect.top);
        accRect.right = min(rect.right, accRect.right);
        accRect.bottom = min(rect.bottom, accRect.bottom);
        accRect.left = max(rect.left, accRect.left);
        return accRect;
      }, getClientRectFromMixedType(element, firstClippingParent));
      clippingRect.width = clippingRect.right - clippingRect.left;
      clippingRect.height = clippingRect.bottom - clippingRect.top;
      clippingRect.x = clippingRect.left;
      clippingRect.y = clippingRect.top;
      return clippingRect;
    }

    function getVariation(placement) {
      return placement.split('-')[1];
    }

    function getMainAxisFromPlacement(placement) {
      return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y';
    }

    function computeOffsets(_ref) {
      var reference = _ref.reference,
          element = _ref.element,
          placement = _ref.placement;
      var basePlacement = placement ? getBasePlacement(placement) : null;
      var variation = placement ? getVariation(placement) : null;
      var commonX = reference.x + reference.width / 2 - element.width / 2;
      var commonY = reference.y + reference.height / 2 - element.height / 2;
      var offsets;

      switch (basePlacement) {
        case top:
          offsets = {
            x: commonX,
            y: reference.y - element.height
          };
          break;

        case bottom:
          offsets = {
            x: commonX,
            y: reference.y + reference.height
          };
          break;

        case right:
          offsets = {
            x: reference.x + reference.width,
            y: commonY
          };
          break;

        case left:
          offsets = {
            x: reference.x - element.width,
            y: commonY
          };
          break;

        default:
          offsets = {
            x: reference.x,
            y: reference.y
          };
      }

      var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;

      if (mainAxis != null) {
        var len = mainAxis === 'y' ? 'height' : 'width';

        switch (variation) {
          case start:
            offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
            break;

          case end:
            offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
            break;
        }
      }

      return offsets;
    }

    function getFreshSideObject() {
      return {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      };
    }

    function mergePaddingObject(paddingObject) {
      return Object.assign({}, getFreshSideObject(), paddingObject);
    }

    function expandToHashMap(value, keys) {
      return keys.reduce(function (hashMap, key) {
        hashMap[key] = value;
        return hashMap;
      }, {});
    }

    function detectOverflow(state, options) {
      if (options === void 0) {
        options = {};
      }

      var _options = options,
          _options$placement = _options.placement,
          placement = _options$placement === void 0 ? state.placement : _options$placement,
          _options$boundary = _options.boundary,
          boundary = _options$boundary === void 0 ? clippingParents : _options$boundary,
          _options$rootBoundary = _options.rootBoundary,
          rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary,
          _options$elementConte = _options.elementContext,
          elementContext = _options$elementConte === void 0 ? popper : _options$elementConte,
          _options$altBoundary = _options.altBoundary,
          altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary,
          _options$padding = _options.padding,
          padding = _options$padding === void 0 ? 0 : _options$padding;
      var paddingObject = mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
      var altContext = elementContext === popper ? reference : popper;
      var popperRect = state.rects.popper;
      var element = state.elements[altBoundary ? altContext : elementContext];
      var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary);
      var referenceClientRect = getBoundingClientRect(state.elements.reference);
      var popperOffsets = computeOffsets({
        reference: referenceClientRect,
        element: popperRect,
        strategy: 'absolute',
        placement: placement
      });
      var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets));
      var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
      // 0 or negative = within the clipping rect

      var overflowOffsets = {
        top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
        bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
        left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
        right: elementClientRect.right - clippingClientRect.right + paddingObject.right
      };
      var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element

      if (elementContext === popper && offsetData) {
        var offset = offsetData[placement];
        Object.keys(overflowOffsets).forEach(function (key) {
          var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
          var axis = [top, bottom].indexOf(key) >= 0 ? 'y' : 'x';
          overflowOffsets[key] += offset[axis] * multiply;
        });
      }

      return overflowOffsets;
    }

    var DEFAULT_OPTIONS = {
      placement: 'bottom',
      modifiers: [],
      strategy: 'absolute'
    };

    function areValidElements() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return !args.some(function (element) {
        return !(element && typeof element.getBoundingClientRect === 'function');
      });
    }

    function popperGenerator(generatorOptions) {
      if (generatorOptions === void 0) {
        generatorOptions = {};
      }

      var _generatorOptions = generatorOptions,
          _generatorOptions$def = _generatorOptions.defaultModifiers,
          defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def,
          _generatorOptions$def2 = _generatorOptions.defaultOptions,
          defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
      return function createPopper(reference, popper, options) {
        if (options === void 0) {
          options = defaultOptions;
        }

        var state = {
          placement: 'bottom',
          orderedModifiers: [],
          options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
          modifiersData: {},
          elements: {
            reference: reference,
            popper: popper
          },
          attributes: {},
          styles: {}
        };
        var effectCleanupFns = [];
        var isDestroyed = false;
        var instance = {
          state: state,
          setOptions: function setOptions(setOptionsAction) {
            var options = typeof setOptionsAction === 'function' ? setOptionsAction(state.options) : setOptionsAction;
            cleanupModifierEffects();
            state.options = Object.assign({}, defaultOptions, state.options, options);
            state.scrollParents = {
              reference: isElement(reference) ? listScrollParents(reference) : reference.contextElement ? listScrollParents(reference.contextElement) : [],
              popper: listScrollParents(popper)
            }; // Orders the modifiers based on their dependencies and `phase`
            // properties

            var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers, state.options.modifiers))); // Strip out disabled modifiers

            state.orderedModifiers = orderedModifiers.filter(function (m) {
              return m.enabled;
            }); // Validate the provided modifiers so that the consumer will get warned

            runModifierEffects();
            return instance.update();
          },
          // Sync update – it will always be executed, even if not necessary. This
          // is useful for low frequency updates where sync behavior simplifies the
          // logic.
          // For high frequency updates (e.g. `resize` and `scroll` events), always
          // prefer the async Popper#update method
          forceUpdate: function forceUpdate() {
            if (isDestroyed) {
              return;
            }

            var _state$elements = state.elements,
                reference = _state$elements.reference,
                popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
            // anymore

            if (!areValidElements(reference, popper)) {

              return;
            } // Store the reference and popper rects to be read by modifiers


            state.rects = {
              reference: getCompositeRect(reference, getOffsetParent(popper), state.options.strategy === 'fixed'),
              popper: getLayoutRect(popper)
            }; // Modifiers have the ability to reset the current update cycle. The
            // most common use case for this is the `flip` modifier changing the
            // placement, which then needs to re-run all the modifiers, because the
            // logic was previously ran for the previous placement and is therefore
            // stale/incorrect

            state.reset = false;
            state.placement = state.options.placement; // On each update cycle, the `modifiersData` property for each modifier
            // is filled with the initial data specified by the modifier. This means
            // it doesn't persist and is fresh on each update.
            // To ensure persistent data, use `${name}#persistent`

            state.orderedModifiers.forEach(function (modifier) {
              return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
            });

            for (var index = 0; index < state.orderedModifiers.length; index++) {

              if (state.reset === true) {
                state.reset = false;
                index = -1;
                continue;
              }

              var _state$orderedModifie = state.orderedModifiers[index],
                  fn = _state$orderedModifie.fn,
                  _state$orderedModifie2 = _state$orderedModifie.options,
                  _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2,
                  name = _state$orderedModifie.name;

              if (typeof fn === 'function') {
                state = fn({
                  state: state,
                  options: _options,
                  name: name,
                  instance: instance
                }) || state;
              }
            }
          },
          // Async and optimistically optimized update – it will not be executed if
          // not necessary (debounced to run at most once-per-tick)
          update: debounce(function () {
            return new Promise(function (resolve) {
              instance.forceUpdate();
              resolve(state);
            });
          }),
          destroy: function destroy() {
            cleanupModifierEffects();
            isDestroyed = true;
          }
        };

        if (!areValidElements(reference, popper)) {

          return instance;
        }

        instance.setOptions(options).then(function (state) {
          if (!isDestroyed && options.onFirstUpdate) {
            options.onFirstUpdate(state);
          }
        }); // Modifiers have the ability to execute arbitrary code before the first
        // update cycle runs. They will be executed in the same order as the update
        // cycle. This is useful when a modifier adds some persistent data that
        // other modifiers need to use, but the modifier is run after the dependent
        // one.

        function runModifierEffects() {
          state.orderedModifiers.forEach(function (_ref3) {
            var name = _ref3.name,
                _ref3$options = _ref3.options,
                options = _ref3$options === void 0 ? {} : _ref3$options,
                effect = _ref3.effect;

            if (typeof effect === 'function') {
              var cleanupFn = effect({
                state: state,
                name: name,
                instance: instance,
                options: options
              });

              var noopFn = function noopFn() {};

              effectCleanupFns.push(cleanupFn || noopFn);
            }
          });
        }

        function cleanupModifierEffects() {
          effectCleanupFns.forEach(function (fn) {
            return fn();
          });
          effectCleanupFns = [];
        }

        return instance;
      };
    }

    var passive = {
      passive: true
    };

    function effect$2(_ref) {
      var state = _ref.state,
          instance = _ref.instance,
          options = _ref.options;
      var _options$scroll = options.scroll,
          scroll = _options$scroll === void 0 ? true : _options$scroll,
          _options$resize = options.resize,
          resize = _options$resize === void 0 ? true : _options$resize;
      var window = getWindow(state.elements.popper);
      var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);

      if (scroll) {
        scrollParents.forEach(function (scrollParent) {
          scrollParent.addEventListener('scroll', instance.update, passive);
        });
      }

      if (resize) {
        window.addEventListener('resize', instance.update, passive);
      }

      return function () {
        if (scroll) {
          scrollParents.forEach(function (scrollParent) {
            scrollParent.removeEventListener('scroll', instance.update, passive);
          });
        }

        if (resize) {
          window.removeEventListener('resize', instance.update, passive);
        }
      };
    } // eslint-disable-next-line import/no-unused-modules


    var eventListeners = {
      name: 'eventListeners',
      enabled: true,
      phase: 'write',
      fn: function fn() {},
      effect: effect$2,
      data: {}
    };

    function popperOffsets(_ref) {
      var state = _ref.state,
          name = _ref.name;
      // Offsets are the actual position the popper needs to have to be
      // properly positioned near its reference element
      // This is the most basic placement, and will be adjusted by
      // the modifiers in the next step
      state.modifiersData[name] = computeOffsets({
        reference: state.rects.reference,
        element: state.rects.popper,
        strategy: 'absolute',
        placement: state.placement
      });
    } // eslint-disable-next-line import/no-unused-modules


    var popperOffsets$1 = {
      name: 'popperOffsets',
      enabled: true,
      phase: 'read',
      fn: popperOffsets,
      data: {}
    };

    var unsetSides = {
      top: 'auto',
      right: 'auto',
      bottom: 'auto',
      left: 'auto'
    }; // Round the offsets to the nearest suitable subpixel based on the DPR.
    // Zooming can change the DPR, but it seems to report a value that will
    // cleanly divide the values into the appropriate subpixels.

    function roundOffsetsByDPR(_ref) {
      var x = _ref.x,
          y = _ref.y;
      var win = window;
      var dpr = win.devicePixelRatio || 1;
      return {
        x: round(x * dpr) / dpr || 0,
        y: round(y * dpr) / dpr || 0
      };
    }

    function mapToStyles(_ref2) {
      var _Object$assign2;

      var popper = _ref2.popper,
          popperRect = _ref2.popperRect,
          placement = _ref2.placement,
          variation = _ref2.variation,
          offsets = _ref2.offsets,
          position = _ref2.position,
          gpuAcceleration = _ref2.gpuAcceleration,
          adaptive = _ref2.adaptive,
          roundOffsets = _ref2.roundOffsets,
          isFixed = _ref2.isFixed;
      var _offsets$x = offsets.x,
          x = _offsets$x === void 0 ? 0 : _offsets$x,
          _offsets$y = offsets.y,
          y = _offsets$y === void 0 ? 0 : _offsets$y;

      var _ref3 = typeof roundOffsets === 'function' ? roundOffsets({
        x: x,
        y: y
      }) : {
        x: x,
        y: y
      };

      x = _ref3.x;
      y = _ref3.y;
      var hasX = offsets.hasOwnProperty('x');
      var hasY = offsets.hasOwnProperty('y');
      var sideX = left;
      var sideY = top;
      var win = window;

      if (adaptive) {
        var offsetParent = getOffsetParent(popper);
        var heightProp = 'clientHeight';
        var widthProp = 'clientWidth';

        if (offsetParent === getWindow(popper)) {
          offsetParent = getDocumentElement(popper);

          if (getComputedStyle(offsetParent).position !== 'static' && position === 'absolute') {
            heightProp = 'scrollHeight';
            widthProp = 'scrollWidth';
          }
        } // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it


        offsetParent = offsetParent;

        if (placement === top || (placement === left || placement === right) && variation === end) {
          sideY = bottom;
          var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : // $FlowFixMe[prop-missing]
          offsetParent[heightProp];
          y -= offsetY - popperRect.height;
          y *= gpuAcceleration ? 1 : -1;
        }

        if (placement === left || (placement === top || placement === bottom) && variation === end) {
          sideX = right;
          var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : // $FlowFixMe[prop-missing]
          offsetParent[widthProp];
          x -= offsetX - popperRect.width;
          x *= gpuAcceleration ? 1 : -1;
        }
      }

      var commonStyles = Object.assign({
        position: position
      }, adaptive && unsetSides);

      var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
        x: x,
        y: y
      }) : {
        x: x,
        y: y
      };

      x = _ref4.x;
      y = _ref4.y;

      if (gpuAcceleration) {
        var _Object$assign;

        return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
      }

      return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : '', _Object$assign2[sideX] = hasX ? x + "px" : '', _Object$assign2.transform = '', _Object$assign2));
    }

    function computeStyles(_ref5) {
      var state = _ref5.state,
          options = _ref5.options;
      var _options$gpuAccelerat = options.gpuAcceleration,
          gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat,
          _options$adaptive = options.adaptive,
          adaptive = _options$adaptive === void 0 ? true : _options$adaptive,
          _options$roundOffsets = options.roundOffsets,
          roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;

      var commonStyles = {
        placement: getBasePlacement(state.placement),
        variation: getVariation(state.placement),
        popper: state.elements.popper,
        popperRect: state.rects.popper,
        gpuAcceleration: gpuAcceleration,
        isFixed: state.options.strategy === 'fixed'
      };

      if (state.modifiersData.popperOffsets != null) {
        state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
          offsets: state.modifiersData.popperOffsets,
          position: state.options.strategy,
          adaptive: adaptive,
          roundOffsets: roundOffsets
        })));
      }

      if (state.modifiersData.arrow != null) {
        state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
          offsets: state.modifiersData.arrow,
          position: 'absolute',
          adaptive: false,
          roundOffsets: roundOffsets
        })));
      }

      state.attributes.popper = Object.assign({}, state.attributes.popper, {
        'data-popper-placement': state.placement
      });
    } // eslint-disable-next-line import/no-unused-modules


    var computeStyles$1 = {
      name: 'computeStyles',
      enabled: true,
      phase: 'beforeWrite',
      fn: computeStyles,
      data: {}
    };

    // and applies them to the HTMLElements such as popper and arrow

    function applyStyles(_ref) {
      var state = _ref.state;
      Object.keys(state.elements).forEach(function (name) {
        var style = state.styles[name] || {};
        var attributes = state.attributes[name] || {};
        var element = state.elements[name]; // arrow is optional + virtual elements

        if (!isHTMLElement(element) || !getNodeName(element)) {
          return;
        } // Flow doesn't support to extend this property, but it's the most
        // effective way to apply styles to an HTMLElement
        // $FlowFixMe[cannot-write]


        Object.assign(element.style, style);
        Object.keys(attributes).forEach(function (name) {
          var value = attributes[name];

          if (value === false) {
            element.removeAttribute(name);
          } else {
            element.setAttribute(name, value === true ? '' : value);
          }
        });
      });
    }

    function effect$1(_ref2) {
      var state = _ref2.state;
      var initialStyles = {
        popper: {
          position: state.options.strategy,
          left: '0',
          top: '0',
          margin: '0'
        },
        arrow: {
          position: 'absolute'
        },
        reference: {}
      };
      Object.assign(state.elements.popper.style, initialStyles.popper);
      state.styles = initialStyles;

      if (state.elements.arrow) {
        Object.assign(state.elements.arrow.style, initialStyles.arrow);
      }

      return function () {
        Object.keys(state.elements).forEach(function (name) {
          var element = state.elements[name];
          var attributes = state.attributes[name] || {};
          var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]); // Set all values to an empty string to unset them

          var style = styleProperties.reduce(function (style, property) {
            style[property] = '';
            return style;
          }, {}); // arrow is optional + virtual elements

          if (!isHTMLElement(element) || !getNodeName(element)) {
            return;
          }

          Object.assign(element.style, style);
          Object.keys(attributes).forEach(function (attribute) {
            element.removeAttribute(attribute);
          });
        });
      };
    } // eslint-disable-next-line import/no-unused-modules


    var applyStyles$1 = {
      name: 'applyStyles',
      enabled: true,
      phase: 'write',
      fn: applyStyles,
      effect: effect$1,
      requires: ['computeStyles']
    };

    function distanceAndSkiddingToXY(placement, rects, offset) {
      var basePlacement = getBasePlacement(placement);
      var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;

      var _ref = typeof offset === 'function' ? offset(Object.assign({}, rects, {
        placement: placement
      })) : offset,
          skidding = _ref[0],
          distance = _ref[1];

      skidding = skidding || 0;
      distance = (distance || 0) * invertDistance;
      return [left, right].indexOf(basePlacement) >= 0 ? {
        x: distance,
        y: skidding
      } : {
        x: skidding,
        y: distance
      };
    }

    function offset(_ref2) {
      var state = _ref2.state,
          options = _ref2.options,
          name = _ref2.name;
      var _options$offset = options.offset,
          offset = _options$offset === void 0 ? [0, 0] : _options$offset;
      var data = placements.reduce(function (acc, placement) {
        acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
        return acc;
      }, {});
      var _data$state$placement = data[state.placement],
          x = _data$state$placement.x,
          y = _data$state$placement.y;

      if (state.modifiersData.popperOffsets != null) {
        state.modifiersData.popperOffsets.x += x;
        state.modifiersData.popperOffsets.y += y;
      }

      state.modifiersData[name] = data;
    } // eslint-disable-next-line import/no-unused-modules


    var offset$1 = {
      name: 'offset',
      enabled: true,
      phase: 'main',
      requires: ['popperOffsets'],
      fn: offset
    };

    var hash$1 = {
      left: 'right',
      right: 'left',
      bottom: 'top',
      top: 'bottom'
    };
    function getOppositePlacement(placement) {
      return placement.replace(/left|right|bottom|top/g, function (matched) {
        return hash$1[matched];
      });
    }

    var hash = {
      start: 'end',
      end: 'start'
    };
    function getOppositeVariationPlacement(placement) {
      return placement.replace(/start|end/g, function (matched) {
        return hash[matched];
      });
    }

    function computeAutoPlacement(state, options) {
      if (options === void 0) {
        options = {};
      }

      var _options = options,
          placement = _options.placement,
          boundary = _options.boundary,
          rootBoundary = _options.rootBoundary,
          padding = _options.padding,
          flipVariations = _options.flipVariations,
          _options$allowedAutoP = _options.allowedAutoPlacements,
          allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
      var variation = getVariation(placement);
      var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function (placement) {
        return getVariation(placement) === variation;
      }) : basePlacements;
      var allowedPlacements = placements$1.filter(function (placement) {
        return allowedAutoPlacements.indexOf(placement) >= 0;
      });

      if (allowedPlacements.length === 0) {
        allowedPlacements = placements$1;
      } // $FlowFixMe[incompatible-type]: Flow seems to have problems with two array unions...


      var overflows = allowedPlacements.reduce(function (acc, placement) {
        acc[placement] = detectOverflow(state, {
          placement: placement,
          boundary: boundary,
          rootBoundary: rootBoundary,
          padding: padding
        })[getBasePlacement(placement)];
        return acc;
      }, {});
      return Object.keys(overflows).sort(function (a, b) {
        return overflows[a] - overflows[b];
      });
    }

    function getExpandedFallbackPlacements(placement) {
      if (getBasePlacement(placement) === auto) {
        return [];
      }

      var oppositePlacement = getOppositePlacement(placement);
      return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
    }

    function flip(_ref) {
      var state = _ref.state,
          options = _ref.options,
          name = _ref.name;

      if (state.modifiersData[name]._skip) {
        return;
      }

      var _options$mainAxis = options.mainAxis,
          checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
          _options$altAxis = options.altAxis,
          checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis,
          specifiedFallbackPlacements = options.fallbackPlacements,
          padding = options.padding,
          boundary = options.boundary,
          rootBoundary = options.rootBoundary,
          altBoundary = options.altBoundary,
          _options$flipVariatio = options.flipVariations,
          flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio,
          allowedAutoPlacements = options.allowedAutoPlacements;
      var preferredPlacement = state.options.placement;
      var basePlacement = getBasePlacement(preferredPlacement);
      var isBasePlacement = basePlacement === preferredPlacement;
      var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
      var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function (acc, placement) {
        return acc.concat(getBasePlacement(placement) === auto ? computeAutoPlacement(state, {
          placement: placement,
          boundary: boundary,
          rootBoundary: rootBoundary,
          padding: padding,
          flipVariations: flipVariations,
          allowedAutoPlacements: allowedAutoPlacements
        }) : placement);
      }, []);
      var referenceRect = state.rects.reference;
      var popperRect = state.rects.popper;
      var checksMap = new Map();
      var makeFallbackChecks = true;
      var firstFittingPlacement = placements[0];

      for (var i = 0; i < placements.length; i++) {
        var placement = placements[i];

        var _basePlacement = getBasePlacement(placement);

        var isStartVariation = getVariation(placement) === start;
        var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
        var len = isVertical ? 'width' : 'height';
        var overflow = detectOverflow(state, {
          placement: placement,
          boundary: boundary,
          rootBoundary: rootBoundary,
          altBoundary: altBoundary,
          padding: padding
        });
        var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;

        if (referenceRect[len] > popperRect[len]) {
          mainVariationSide = getOppositePlacement(mainVariationSide);
        }

        var altVariationSide = getOppositePlacement(mainVariationSide);
        var checks = [];

        if (checkMainAxis) {
          checks.push(overflow[_basePlacement] <= 0);
        }

        if (checkAltAxis) {
          checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
        }

        if (checks.every(function (check) {
          return check;
        })) {
          firstFittingPlacement = placement;
          makeFallbackChecks = false;
          break;
        }

        checksMap.set(placement, checks);
      }

      if (makeFallbackChecks) {
        // `2` may be desired in some cases – research later
        var numberOfChecks = flipVariations ? 3 : 1;

        var _loop = function _loop(_i) {
          var fittingPlacement = placements.find(function (placement) {
            var checks = checksMap.get(placement);

            if (checks) {
              return checks.slice(0, _i).every(function (check) {
                return check;
              });
            }
          });

          if (fittingPlacement) {
            firstFittingPlacement = fittingPlacement;
            return "break";
          }
        };

        for (var _i = numberOfChecks; _i > 0; _i--) {
          var _ret = _loop(_i);

          if (_ret === "break") break;
        }
      }

      if (state.placement !== firstFittingPlacement) {
        state.modifiersData[name]._skip = true;
        state.placement = firstFittingPlacement;
        state.reset = true;
      }
    } // eslint-disable-next-line import/no-unused-modules


    var flip$1 = {
      name: 'flip',
      enabled: true,
      phase: 'main',
      fn: flip,
      requiresIfExists: ['offset'],
      data: {
        _skip: false
      }
    };

    function getAltAxis(axis) {
      return axis === 'x' ? 'y' : 'x';
    }

    function within(min$1, value, max$1) {
      return max(min$1, min(value, max$1));
    }
    function withinMaxClamp(min, value, max) {
      var v = within(min, value, max);
      return v > max ? max : v;
    }

    function preventOverflow(_ref) {
      var state = _ref.state,
          options = _ref.options,
          name = _ref.name;
      var _options$mainAxis = options.mainAxis,
          checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
          _options$altAxis = options.altAxis,
          checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis,
          boundary = options.boundary,
          rootBoundary = options.rootBoundary,
          altBoundary = options.altBoundary,
          padding = options.padding,
          _options$tether = options.tether,
          tether = _options$tether === void 0 ? true : _options$tether,
          _options$tetherOffset = options.tetherOffset,
          tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
      var overflow = detectOverflow(state, {
        boundary: boundary,
        rootBoundary: rootBoundary,
        padding: padding,
        altBoundary: altBoundary
      });
      var basePlacement = getBasePlacement(state.placement);
      var variation = getVariation(state.placement);
      var isBasePlacement = !variation;
      var mainAxis = getMainAxisFromPlacement(basePlacement);
      var altAxis = getAltAxis(mainAxis);
      var popperOffsets = state.modifiersData.popperOffsets;
      var referenceRect = state.rects.reference;
      var popperRect = state.rects.popper;
      var tetherOffsetValue = typeof tetherOffset === 'function' ? tetherOffset(Object.assign({}, state.rects, {
        placement: state.placement
      })) : tetherOffset;
      var normalizedTetherOffsetValue = typeof tetherOffsetValue === 'number' ? {
        mainAxis: tetherOffsetValue,
        altAxis: tetherOffsetValue
      } : Object.assign({
        mainAxis: 0,
        altAxis: 0
      }, tetherOffsetValue);
      var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
      var data = {
        x: 0,
        y: 0
      };

      if (!popperOffsets) {
        return;
      }

      if (checkMainAxis) {
        var _offsetModifierState$;

        var mainSide = mainAxis === 'y' ? top : left;
        var altSide = mainAxis === 'y' ? bottom : right;
        var len = mainAxis === 'y' ? 'height' : 'width';
        var offset = popperOffsets[mainAxis];
        var min$1 = offset + overflow[mainSide];
        var max$1 = offset - overflow[altSide];
        var additive = tether ? -popperRect[len] / 2 : 0;
        var minLen = variation === start ? referenceRect[len] : popperRect[len];
        var maxLen = variation === start ? -popperRect[len] : -referenceRect[len]; // We need to include the arrow in the calculation so the arrow doesn't go
        // outside the reference bounds

        var arrowElement = state.elements.arrow;
        var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
          width: 0,
          height: 0
        };
        var arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : getFreshSideObject();
        var arrowPaddingMin = arrowPaddingObject[mainSide];
        var arrowPaddingMax = arrowPaddingObject[altSide]; // If the reference length is smaller than the arrow length, we don't want
        // to include its full size in the calculation. If the reference is small
        // and near the edge of a boundary, the popper can overflow even if the
        // reference is not overflowing as well (e.g. virtual elements with no
        // width or height)

        var arrowLen = within(0, referenceRect[len], arrowRect[len]);
        var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
        var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
        var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
        var clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
        var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
        var tetherMin = offset + minOffset - offsetModifierValue - clientOffset;
        var tetherMax = offset + maxOffset - offsetModifierValue;
        var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset, tether ? max(max$1, tetherMax) : max$1);
        popperOffsets[mainAxis] = preventedOffset;
        data[mainAxis] = preventedOffset - offset;
      }

      if (checkAltAxis) {
        var _offsetModifierState$2;

        var _mainSide = mainAxis === 'x' ? top : left;

        var _altSide = mainAxis === 'x' ? bottom : right;

        var _offset = popperOffsets[altAxis];

        var _len = altAxis === 'y' ? 'height' : 'width';

        var _min = _offset + overflow[_mainSide];

        var _max = _offset - overflow[_altSide];

        var isOriginSide = [top, left].indexOf(basePlacement) !== -1;

        var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;

        var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;

        var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;

        var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);

        popperOffsets[altAxis] = _preventedOffset;
        data[altAxis] = _preventedOffset - _offset;
      }

      state.modifiersData[name] = data;
    } // eslint-disable-next-line import/no-unused-modules


    var preventOverflow$1 = {
      name: 'preventOverflow',
      enabled: true,
      phase: 'main',
      fn: preventOverflow,
      requiresIfExists: ['offset']
    };

    var toPaddingObject = function toPaddingObject(padding, state) {
      padding = typeof padding === 'function' ? padding(Object.assign({}, state.rects, {
        placement: state.placement
      })) : padding;
      return mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
    };

    function arrow(_ref) {
      var _state$modifiersData$;

      var state = _ref.state,
          name = _ref.name,
          options = _ref.options;
      var arrowElement = state.elements.arrow;
      var popperOffsets = state.modifiersData.popperOffsets;
      var basePlacement = getBasePlacement(state.placement);
      var axis = getMainAxisFromPlacement(basePlacement);
      var isVertical = [left, right].indexOf(basePlacement) >= 0;
      var len = isVertical ? 'height' : 'width';

      if (!arrowElement || !popperOffsets) {
        return;
      }

      var paddingObject = toPaddingObject(options.padding, state);
      var arrowRect = getLayoutRect(arrowElement);
      var minProp = axis === 'y' ? top : left;
      var maxProp = axis === 'y' ? bottom : right;
      var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
      var startDiff = popperOffsets[axis] - state.rects.reference[axis];
      var arrowOffsetParent = getOffsetParent(arrowElement);
      var clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
      var centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the popper if the center point is
      // outside of the popper bounds

      var min = paddingObject[minProp];
      var max = clientSize - arrowRect[len] - paddingObject[maxProp];
      var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
      var offset = within(min, center, max); // Prevents breaking syntax highlighting...

      var axisProp = axis;
      state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
    }

    function effect(_ref2) {
      var state = _ref2.state,
          options = _ref2.options;
      var _options$element = options.element,
          arrowElement = _options$element === void 0 ? '[data-popper-arrow]' : _options$element;

      if (arrowElement == null) {
        return;
      } // CSS selector


      if (typeof arrowElement === 'string') {
        arrowElement = state.elements.popper.querySelector(arrowElement);

        if (!arrowElement) {
          return;
        }
      }

      if (!contains(state.elements.popper, arrowElement)) {

        return;
      }

      state.elements.arrow = arrowElement;
    } // eslint-disable-next-line import/no-unused-modules


    var arrow$1 = {
      name: 'arrow',
      enabled: true,
      phase: 'main',
      fn: arrow,
      effect: effect,
      requires: ['popperOffsets'],
      requiresIfExists: ['preventOverflow']
    };

    function getSideOffsets(overflow, rect, preventedOffsets) {
      if (preventedOffsets === void 0) {
        preventedOffsets = {
          x: 0,
          y: 0
        };
      }

      return {
        top: overflow.top - rect.height - preventedOffsets.y,
        right: overflow.right - rect.width + preventedOffsets.x,
        bottom: overflow.bottom - rect.height + preventedOffsets.y,
        left: overflow.left - rect.width - preventedOffsets.x
      };
    }

    function isAnySideFullyClipped(overflow) {
      return [top, right, bottom, left].some(function (side) {
        return overflow[side] >= 0;
      });
    }

    function hide(_ref) {
      var state = _ref.state,
          name = _ref.name;
      var referenceRect = state.rects.reference;
      var popperRect = state.rects.popper;
      var preventedOffsets = state.modifiersData.preventOverflow;
      var referenceOverflow = detectOverflow(state, {
        elementContext: 'reference'
      });
      var popperAltOverflow = detectOverflow(state, {
        altBoundary: true
      });
      var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
      var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
      var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
      var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
      state.modifiersData[name] = {
        referenceClippingOffsets: referenceClippingOffsets,
        popperEscapeOffsets: popperEscapeOffsets,
        isReferenceHidden: isReferenceHidden,
        hasPopperEscaped: hasPopperEscaped
      };
      state.attributes.popper = Object.assign({}, state.attributes.popper, {
        'data-popper-reference-hidden': isReferenceHidden,
        'data-popper-escaped': hasPopperEscaped
      });
    } // eslint-disable-next-line import/no-unused-modules


    var hide$1 = {
      name: 'hide',
      enabled: true,
      phase: 'main',
      requiresIfExists: ['preventOverflow'],
      fn: hide
    };

    var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$1];
    var createPopper = /*#__PURE__*/popperGenerator({
      defaultModifiers: defaultModifiers
    }); // eslint-disable-next-line import/no-unused-modules

    // Code derived from https://github.com/bryanmylee/svelte-popperjs/blob/master/src/index.ts
    function createPopperActions(initOptions) {
      let contentNode;
      let options = initOptions;
      let popperInstance = null;
      let referenceNode;

      const initPopper = () => {
        if (referenceNode && contentNode) {
          popperInstance = createPopper(referenceNode, contentNode, options);
        }
      };

      const deinitPopper = () => {
        if (popperInstance) {
          popperInstance.destroy();
          popperInstance = null;
        }
      };

      const referenceAction = (node) => {
        referenceNode = node;
        initPopper();
        return {
          destroy() {
            deinitPopper();
          }
        };
      };

      const contentAction = (node, contentOptions) => {
        contentNode = node;
        options = Object.assign(Object.assign({}, initOptions), contentOptions);
        initPopper();

        return {
          update(newContentOptions) {
            options = Object.assign(
              Object.assign({}, initOptions),
              newContentOptions
            );
            if (popperInstance && options) {
              popperInstance.setOptions(options);
            }
          },
          destroy() {
            deinitPopper();
          }
        };
      };

      return [referenceAction, contentAction, () => popperInstance];
    }

    const createContext = () => writable({});

    /* node_modules/sveltestrap/src/Dropdown.svelte generated by Svelte v3.48.0 */

    const { Error: Error_1 } = globals;
    const file$i = "node_modules/sveltestrap/src/Dropdown.svelte";

    // (123:0) {:else}
    function create_else_block$5(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[18].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[17], null);
    	let div_levels = [/*$$restProps*/ ctx[3], { class: /*classes*/ ctx[2] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$i, 123, 2, 3209);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[20](div);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 131072)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[17],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[17])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[17], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3],
    				(!current || dirty & /*classes*/ 4) && { class: /*classes*/ ctx[2] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[20](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(123:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (119:0) {#if nav}
    function create_if_block$5(ctx) {
    	let li;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[18].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[17], null);
    	let li_levels = [/*$$restProps*/ ctx[3], { class: /*classes*/ ctx[2] }];
    	let li_data = {};

    	for (let i = 0; i < li_levels.length; i += 1) {
    		li_data = assign(li_data, li_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			if (default_slot) default_slot.c();
    			set_attributes(li, li_data);
    			add_location(li, file$i, 119, 2, 3118);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);

    			if (default_slot) {
    				default_slot.m(li, null);
    			}

    			/*li_binding*/ ctx[19](li);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 131072)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[17],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[17])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[17], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(li, li_data = get_spread_update(li_levels, [
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3],
    				(!current || dirty & /*classes*/ 4) && { class: /*classes*/ ctx[2] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (default_slot) default_slot.d(detaching);
    			/*li_binding*/ ctx[19](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(119:0) {#if nav}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$5, create_else_block$5];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*nav*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let subItemIsActive;
    	let classes;
    	let handleToggle;

    	const omit_props_names = [
    		"class","active","direction","dropup","group","inNavbar","isOpen","nav","setActiveFromChild","size","toggle"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Dropdown', slots, ['default']);
    	const noop = () => undefined;
    	let context = createContext();
    	setContext('dropdownContext', context);
    	const navbarContext = getContext('navbar');
    	let { class: className = '' } = $$props;
    	let { active = false } = $$props;
    	let { direction = 'down' } = $$props;
    	let { dropup = false } = $$props;
    	let { group = false } = $$props;
    	let { inNavbar = navbarContext ? navbarContext.inNavbar : false } = $$props;
    	let { isOpen = false } = $$props;
    	let { nav = false } = $$props;
    	let { setActiveFromChild = false } = $$props;
    	let { size = '' } = $$props;
    	let { toggle = undefined } = $$props;
    	const [popperRef, popperContent] = createPopperActions();
    	const validDirections = ['up', 'down', 'left', 'right', 'start', 'end'];

    	if (validDirections.indexOf(direction) === -1) {
    		throw new Error(`Invalid direction sent: '${direction}' is not one of 'up', 'down', 'left', 'right', 'start', 'end'`);
    	}

    	let component;
    	let dropdownDirection;

    	function handleDocumentClick(e) {
    		if (e && (e.which === 3 || e.type === 'keyup' && e.which !== 9)) return;

    		if (component.contains(e.target) && component !== e.target && (e.type !== 'keyup' || e.which === 9)) {
    			return;
    		}

    		handleToggle(e);
    	}

    	onDestroy(() => {
    		if (typeof document !== 'undefined') {
    			['click', 'touchstart', 'keyup'].forEach(event => document.removeEventListener(event, handleDocumentClick, true));
    		}
    	});

    	function li_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			component = $$value;
    			$$invalidate(1, component);
    		});
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			component = $$value;
    			$$invalidate(1, component);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(5, className = $$new_props.class);
    		if ('active' in $$new_props) $$invalidate(6, active = $$new_props.active);
    		if ('direction' in $$new_props) $$invalidate(7, direction = $$new_props.direction);
    		if ('dropup' in $$new_props) $$invalidate(8, dropup = $$new_props.dropup);
    		if ('group' in $$new_props) $$invalidate(9, group = $$new_props.group);
    		if ('inNavbar' in $$new_props) $$invalidate(10, inNavbar = $$new_props.inNavbar);
    		if ('isOpen' in $$new_props) $$invalidate(4, isOpen = $$new_props.isOpen);
    		if ('nav' in $$new_props) $$invalidate(0, nav = $$new_props.nav);
    		if ('setActiveFromChild' in $$new_props) $$invalidate(11, setActiveFromChild = $$new_props.setActiveFromChild);
    		if ('size' in $$new_props) $$invalidate(12, size = $$new_props.size);
    		if ('toggle' in $$new_props) $$invalidate(13, toggle = $$new_props.toggle);
    		if ('$$scope' in $$new_props) $$invalidate(17, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		setContext,
    		onDestroy,
    		createPopperActions,
    		classnames,
    		createContext,
    		noop,
    		context,
    		navbarContext,
    		className,
    		active,
    		direction,
    		dropup,
    		group,
    		inNavbar,
    		isOpen,
    		nav,
    		setActiveFromChild,
    		size,
    		toggle,
    		popperRef,
    		popperContent,
    		validDirections,
    		component,
    		dropdownDirection,
    		handleDocumentClick,
    		handleToggle,
    		subItemIsActive,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('context' in $$props) $$invalidate(22, context = $$new_props.context);
    		if ('className' in $$props) $$invalidate(5, className = $$new_props.className);
    		if ('active' in $$props) $$invalidate(6, active = $$new_props.active);
    		if ('direction' in $$props) $$invalidate(7, direction = $$new_props.direction);
    		if ('dropup' in $$props) $$invalidate(8, dropup = $$new_props.dropup);
    		if ('group' in $$props) $$invalidate(9, group = $$new_props.group);
    		if ('inNavbar' in $$props) $$invalidate(10, inNavbar = $$new_props.inNavbar);
    		if ('isOpen' in $$props) $$invalidate(4, isOpen = $$new_props.isOpen);
    		if ('nav' in $$props) $$invalidate(0, nav = $$new_props.nav);
    		if ('setActiveFromChild' in $$props) $$invalidate(11, setActiveFromChild = $$new_props.setActiveFromChild);
    		if ('size' in $$props) $$invalidate(12, size = $$new_props.size);
    		if ('toggle' in $$props) $$invalidate(13, toggle = $$new_props.toggle);
    		if ('component' in $$props) $$invalidate(1, component = $$new_props.component);
    		if ('dropdownDirection' in $$props) $$invalidate(14, dropdownDirection = $$new_props.dropdownDirection);
    		if ('handleToggle' in $$props) $$invalidate(15, handleToggle = $$new_props.handleToggle);
    		if ('subItemIsActive' in $$props) $$invalidate(16, subItemIsActive = $$new_props.subItemIsActive);
    		if ('classes' in $$props) $$invalidate(2, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*setActiveFromChild, component*/ 2050) {
    			$$invalidate(16, subItemIsActive = !!(setActiveFromChild && component && typeof component.querySelector === 'function' && component.querySelector('.active')));
    		}

    		if ($$self.$$.dirty & /*direction*/ 128) {
    			{
    				if (direction === 'left') $$invalidate(14, dropdownDirection = 'start'); else if (direction === 'right') $$invalidate(14, dropdownDirection = 'end'); else $$invalidate(14, dropdownDirection = direction);
    			}
    		}

    		if ($$self.$$.dirty & /*toggle, isOpen*/ 8208) {
    			$$invalidate(15, handleToggle = toggle || (() => $$invalidate(4, isOpen = !isOpen)));
    		}

    		if ($$self.$$.dirty & /*className, direction, dropdownDirection, nav, active, setActiveFromChild, subItemIsActive, group, size, isOpen*/ 88817) {
    			$$invalidate(2, classes = classnames(className, direction !== 'down' && `drop${dropdownDirection}`, nav && active ? 'active' : false, setActiveFromChild && subItemIsActive ? 'active' : false, {
    				'btn-group': group,
    				[`btn-group-${size}`]: !!size,
    				dropdown: !group,
    				show: isOpen,
    				'nav-item': nav
    			}));
    		}

    		if ($$self.$$.dirty & /*isOpen*/ 16) {
    			{
    				if (typeof document !== 'undefined') {
    					if (isOpen) {
    						['click', 'touchstart', 'keyup'].forEach(event => document.addEventListener(event, handleDocumentClick, true));
    					} else {
    						['click', 'touchstart', 'keyup'].forEach(event => document.removeEventListener(event, handleDocumentClick, true));
    					}
    				}
    			}
    		}

    		if ($$self.$$.dirty & /*handleToggle, isOpen, direction, dropup, nav, inNavbar*/ 34193) {
    			{
    				context.update(() => {
    					return {
    						toggle: handleToggle,
    						isOpen,
    						direction: direction === 'down' && dropup ? 'up' : direction,
    						inNavbar: nav || inNavbar,
    						popperRef: nav ? noop : popperRef,
    						popperContent: nav ? noop : popperContent
    					};
    				});
    			}
    		}
    	};

    	return [
    		nav,
    		component,
    		classes,
    		$$restProps,
    		isOpen,
    		className,
    		active,
    		direction,
    		dropup,
    		group,
    		inNavbar,
    		setActiveFromChild,
    		size,
    		toggle,
    		dropdownDirection,
    		handleToggle,
    		subItemIsActive,
    		$$scope,
    		slots,
    		li_binding,
    		div_binding
    	];
    }

    class Dropdown extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$l, create_fragment$l, safe_not_equal, {
    			class: 5,
    			active: 6,
    			direction: 7,
    			dropup: 8,
    			group: 9,
    			inNavbar: 10,
    			isOpen: 4,
    			nav: 0,
    			setActiveFromChild: 11,
    			size: 12,
    			toggle: 13
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dropdown",
    			options,
    			id: create_fragment$l.name
    		});
    	}

    	get class() {
    		throw new Error_1("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error_1("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error_1("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error_1("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get direction() {
    		throw new Error_1("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set direction(value) {
    		throw new Error_1("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dropup() {
    		throw new Error_1("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dropup(value) {
    		throw new Error_1("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get group() {
    		throw new Error_1("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set group(value) {
    		throw new Error_1("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inNavbar() {
    		throw new Error_1("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inNavbar(value) {
    		throw new Error_1("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isOpen() {
    		throw new Error_1("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isOpen(value) {
    		throw new Error_1("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get nav() {
    		throw new Error_1("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nav(value) {
    		throw new Error_1("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get setActiveFromChild() {
    		throw new Error_1("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set setActiveFromChild(value) {
    		throw new Error_1("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error_1("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error_1("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get toggle() {
    		throw new Error_1("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set toggle(value) {
    		throw new Error_1("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/Col.svelte generated by Svelte v3.48.0 */
    const file$h = "node_modules/sveltestrap/src/Col.svelte";

    function create_fragment$k(ctx) {
    	let div;
    	let div_class_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], null);

    	let div_levels = [
    		/*$$restProps*/ ctx[1],
    		{
    			class: div_class_value = /*colClasses*/ ctx[0].join(' ')
    		}
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$h, 63, 0, 1536);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 512)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				{ class: div_class_value }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	const omit_props_names = ["class","xs","sm","md","lg","xl","xxl"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Col', slots, ['default']);
    	let { class: className = '' } = $$props;
    	let { xs = undefined } = $$props;
    	let { sm = undefined } = $$props;
    	let { md = undefined } = $$props;
    	let { lg = undefined } = $$props;
    	let { xl = undefined } = $$props;
    	let { xxl = undefined } = $$props;
    	const colClasses = [];
    	const lookup = { xs, sm, md, lg, xl, xxl };

    	Object.keys(lookup).forEach(colWidth => {
    		const columnProp = lookup[colWidth];

    		if (!columnProp && columnProp !== '') {
    			return; //no value for this width
    		}

    		const isXs = colWidth === 'xs';

    		if (isObject(columnProp)) {
    			const colSizeInterfix = isXs ? '-' : `-${colWidth}-`;
    			const colClass = getColumnSizeClass(isXs, colWidth, columnProp.size);

    			if (columnProp.size || columnProp.size === '') {
    				colClasses.push(colClass);
    			}

    			if (columnProp.push) {
    				colClasses.push(`push${colSizeInterfix}${columnProp.push}`);
    			}

    			if (columnProp.pull) {
    				colClasses.push(`pull${colSizeInterfix}${columnProp.pull}`);
    			}

    			if (columnProp.offset) {
    				colClasses.push(`offset${colSizeInterfix}${columnProp.offset}`);
    			}

    			if (columnProp.order) {
    				colClasses.push(`order${colSizeInterfix}${columnProp.order}`);
    			}
    		} else {
    			colClasses.push(getColumnSizeClass(isXs, colWidth, columnProp));
    		}
    	});

    	if (!colClasses.length) {
    		colClasses.push('col');
    	}

    	if (className) {
    		colClasses.push(className);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('xs' in $$new_props) $$invalidate(3, xs = $$new_props.xs);
    		if ('sm' in $$new_props) $$invalidate(4, sm = $$new_props.sm);
    		if ('md' in $$new_props) $$invalidate(5, md = $$new_props.md);
    		if ('lg' in $$new_props) $$invalidate(6, lg = $$new_props.lg);
    		if ('xl' in $$new_props) $$invalidate(7, xl = $$new_props.xl);
    		if ('xxl' in $$new_props) $$invalidate(8, xxl = $$new_props.xxl);
    		if ('$$scope' in $$new_props) $$invalidate(9, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getColumnSizeClass,
    		isObject,
    		className,
    		xs,
    		sm,
    		md,
    		lg,
    		xl,
    		xxl,
    		colClasses,
    		lookup
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(2, className = $$new_props.className);
    		if ('xs' in $$props) $$invalidate(3, xs = $$new_props.xs);
    		if ('sm' in $$props) $$invalidate(4, sm = $$new_props.sm);
    		if ('md' in $$props) $$invalidate(5, md = $$new_props.md);
    		if ('lg' in $$props) $$invalidate(6, lg = $$new_props.lg);
    		if ('xl' in $$props) $$invalidate(7, xl = $$new_props.xl);
    		if ('xxl' in $$props) $$invalidate(8, xxl = $$new_props.xxl);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [colClasses, $$restProps, className, xs, sm, md, lg, xl, xxl, $$scope, slots];
    }

    class Col extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {
    			class: 2,
    			xs: 3,
    			sm: 4,
    			md: 5,
    			lg: 6,
    			xl: 7,
    			xxl: 8
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Col",
    			options,
    			id: create_fragment$k.name
    		});
    	}

    	get class() {
    		throw new Error("<Col>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Col>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xs() {
    		throw new Error("<Col>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xs(value) {
    		throw new Error("<Col>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sm() {
    		throw new Error("<Col>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sm(value) {
    		throw new Error("<Col>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get md() {
    		throw new Error("<Col>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set md(value) {
    		throw new Error("<Col>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get lg() {
    		throw new Error("<Col>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lg(value) {
    		throw new Error("<Col>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xl() {
    		throw new Error("<Col>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xl(value) {
    		throw new Error("<Col>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xxl() {
    		throw new Error("<Col>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xxl(value) {
    		throw new Error("<Col>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/Container.svelte generated by Svelte v3.48.0 */
    const file$g = "node_modules/sveltestrap/src/Container.svelte";

    function create_fragment$j(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], null);
    	let div_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$g, 23, 0, 542);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 512)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","sm","md","lg","xl","xxl","fluid"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Container', slots, ['default']);
    	let { class: className = '' } = $$props;
    	let { sm = undefined } = $$props;
    	let { md = undefined } = $$props;
    	let { lg = undefined } = $$props;
    	let { xl = undefined } = $$props;
    	let { xxl = undefined } = $$props;
    	let { fluid = false } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('sm' in $$new_props) $$invalidate(3, sm = $$new_props.sm);
    		if ('md' in $$new_props) $$invalidate(4, md = $$new_props.md);
    		if ('lg' in $$new_props) $$invalidate(5, lg = $$new_props.lg);
    		if ('xl' in $$new_props) $$invalidate(6, xl = $$new_props.xl);
    		if ('xxl' in $$new_props) $$invalidate(7, xxl = $$new_props.xxl);
    		if ('fluid' in $$new_props) $$invalidate(8, fluid = $$new_props.fluid);
    		if ('$$scope' in $$new_props) $$invalidate(9, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		sm,
    		md,
    		lg,
    		xl,
    		xxl,
    		fluid,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(2, className = $$new_props.className);
    		if ('sm' in $$props) $$invalidate(3, sm = $$new_props.sm);
    		if ('md' in $$props) $$invalidate(4, md = $$new_props.md);
    		if ('lg' in $$props) $$invalidate(5, lg = $$new_props.lg);
    		if ('xl' in $$props) $$invalidate(6, xl = $$new_props.xl);
    		if ('xxl' in $$props) $$invalidate(7, xxl = $$new_props.xxl);
    		if ('fluid' in $$props) $$invalidate(8, fluid = $$new_props.fluid);
    		if ('classes' in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, sm, md, lg, xl, xxl, fluid*/ 508) {
    			$$invalidate(0, classes = classnames(className, {
    				'container-sm': sm,
    				'container-md': md,
    				'container-lg': lg,
    				'container-xl': xl,
    				'container-xxl': xxl,
    				'container-fluid': fluid,
    				container: !sm && !md && !lg && !xl && !xxl && !fluid
    			}));
    		}
    	};

    	return [classes, $$restProps, className, sm, md, lg, xl, xxl, fluid, $$scope, slots];
    }

    class Container extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {
    			class: 2,
    			sm: 3,
    			md: 4,
    			lg: 5,
    			xl: 6,
    			xxl: 7,
    			fluid: 8
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Container",
    			options,
    			id: create_fragment$j.name
    		});
    	}

    	get class() {
    		throw new Error("<Container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sm() {
    		throw new Error("<Container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sm(value) {
    		throw new Error("<Container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get md() {
    		throw new Error("<Container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set md(value) {
    		throw new Error("<Container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get lg() {
    		throw new Error("<Container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lg(value) {
    		throw new Error("<Container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xl() {
    		throw new Error("<Container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xl(value) {
    		throw new Error("<Container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xxl() {
    		throw new Error("<Container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xxl(value) {
    		throw new Error("<Container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fluid() {
    		throw new Error("<Container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fluid(value) {
    		throw new Error("<Container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/DropdownItem.svelte generated by Svelte v3.48.0 */
    const file$f = "node_modules/sveltestrap/src/DropdownItem.svelte";

    // (49:0) {:else}
    function create_else_block$4(ctx) {
    	let button;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[12].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);
    	let button_levels = [{ type: "button" }, /*$$restProps*/ ctx[6], { class: /*classes*/ ctx[3] }];
    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			set_attributes(button, button_data);
    			add_location(button, file$f, 49, 2, 1086);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			if (button.autofocus) button.focus();
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*click_handler_2*/ ctx[15], false, false, false),
    					listen_dev(button, "click", /*handleItemClick*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[11], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(button, button_data = get_spread_update(button_levels, [
    				{ type: "button" },
    				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6],
    				(!current || dirty & /*classes*/ 8) && { class: /*classes*/ ctx[3] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(49:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (45:15) 
    function create_if_block_2$3(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[12].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);

    	let a_levels = [
    		/*$$restProps*/ ctx[6],
    		{ click: "" },
    		{ href: /*href*/ ctx[2] },
    		{ class: /*classes*/ ctx[3] }
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file$f, 45, 2, 979);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*handleItemClick*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[11], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6],
    				{ click: "" },
    				(!current || dirty & /*href*/ 4) && { href: /*href*/ ctx[2] },
    				(!current || dirty & /*classes*/ 8) && { class: /*classes*/ ctx[3] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(45:15) ",
    		ctx
    	});

    	return block;
    }

    // (41:18) 
    function create_if_block_1$3(ctx) {
    	let div;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[12].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);
    	let div_levels = [/*$$restProps*/ ctx[6], { class: /*classes*/ ctx[3] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$f, 41, 2, 864);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "click", /*click_handler_1*/ ctx[14], false, false, false),
    					listen_dev(div, "click", /*handleItemClick*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[11], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6],
    				(!current || dirty & /*classes*/ 8) && { class: /*classes*/ ctx[3] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(41:18) ",
    		ctx
    	});

    	return block;
    }

    // (37:0) {#if header}
    function create_if_block$4(ctx) {
    	let h6;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[12].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);
    	let h6_levels = [/*$$restProps*/ ctx[6], { class: /*classes*/ ctx[3] }];
    	let h6_data = {};

    	for (let i = 0; i < h6_levels.length; i += 1) {
    		h6_data = assign(h6_data, h6_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			h6 = element("h6");
    			if (default_slot) default_slot.c();
    			set_attributes(h6, h6_data);
    			add_location(h6, file$f, 37, 2, 748);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h6, anchor);

    			if (default_slot) {
    				default_slot.m(h6, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(h6, "click", /*click_handler*/ ctx[13], false, false, false),
    					listen_dev(h6, "click", /*handleItemClick*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[11], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(h6, h6_data = get_spread_update(h6_levels, [
    				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6],
    				(!current || dirty & /*classes*/ 8) && { class: /*classes*/ ctx[3] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h6);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(37:0) {#if header}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$4, create_if_block_1$3, create_if_block_2$3, create_else_block$4];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*header*/ ctx[1]) return 0;
    		if (/*divider*/ ctx[0]) return 1;
    		if (/*href*/ ctx[2]) return 2;
    		return 3;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","active","disabled","divider","header","toggle","href"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $context;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DropdownItem', slots, ['default']);
    	const context = getContext('dropdownContext');
    	validate_store(context, 'context');
    	component_subscribe($$self, context, value => $$invalidate(16, $context = value));
    	let { class: className = '' } = $$props;
    	let { active = false } = $$props;
    	let { disabled = false } = $$props;
    	let { divider = false } = $$props;
    	let { header = false } = $$props;
    	let { toggle = true } = $$props;
    	let { href = '' } = $$props;

    	function handleItemClick(e) {
    		if (disabled || header || divider) {
    			e.preventDefault();
    			return;
    		}

    		if (toggle) {
    			$context.toggle(e);
    		}
    	}

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(7, className = $$new_props.class);
    		if ('active' in $$new_props) $$invalidate(8, active = $$new_props.active);
    		if ('disabled' in $$new_props) $$invalidate(9, disabled = $$new_props.disabled);
    		if ('divider' in $$new_props) $$invalidate(0, divider = $$new_props.divider);
    		if ('header' in $$new_props) $$invalidate(1, header = $$new_props.header);
    		if ('toggle' in $$new_props) $$invalidate(10, toggle = $$new_props.toggle);
    		if ('href' in $$new_props) $$invalidate(2, href = $$new_props.href);
    		if ('$$scope' in $$new_props) $$invalidate(11, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		classnames,
    		context,
    		className,
    		active,
    		disabled,
    		divider,
    		header,
    		toggle,
    		href,
    		handleItemClick,
    		classes,
    		$context
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(7, className = $$new_props.className);
    		if ('active' in $$props) $$invalidate(8, active = $$new_props.active);
    		if ('disabled' in $$props) $$invalidate(9, disabled = $$new_props.disabled);
    		if ('divider' in $$props) $$invalidate(0, divider = $$new_props.divider);
    		if ('header' in $$props) $$invalidate(1, header = $$new_props.header);
    		if ('toggle' in $$props) $$invalidate(10, toggle = $$new_props.toggle);
    		if ('href' in $$props) $$invalidate(2, href = $$new_props.href);
    		if ('classes' in $$props) $$invalidate(3, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, disabled, divider, header, active*/ 899) {
    			$$invalidate(3, classes = classnames(className, {
    				disabled,
    				'dropdown-item': !divider && !header,
    				active,
    				'dropdown-header': header,
    				'dropdown-divider': divider
    			}));
    		}
    	};

    	return [
    		divider,
    		header,
    		href,
    		classes,
    		context,
    		handleItemClick,
    		$$restProps,
    		className,
    		active,
    		disabled,
    		toggle,
    		$$scope,
    		slots,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class DropdownItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {
    			class: 7,
    			active: 8,
    			disabled: 9,
    			divider: 0,
    			header: 1,
    			toggle: 10,
    			href: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DropdownItem",
    			options,
    			id: create_fragment$i.name
    		});
    	}

    	get class() {
    		throw new Error("<DropdownItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<DropdownItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<DropdownItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<DropdownItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<DropdownItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<DropdownItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get divider() {
    		throw new Error("<DropdownItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set divider(value) {
    		throw new Error("<DropdownItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get header() {
    		throw new Error("<DropdownItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set header(value) {
    		throw new Error("<DropdownItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get toggle() {
    		throw new Error("<DropdownItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set toggle(value) {
    		throw new Error("<DropdownItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<DropdownItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<DropdownItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/DropdownMenu.svelte generated by Svelte v3.48.0 */
    const file$e = "node_modules/sveltestrap/src/DropdownMenu.svelte";

    function create_fragment$h(ctx) {
    	let div;
    	let div_data_bs_popper_value;
    	let $context_popperContent_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], null);

    	let div_levels = [
    		/*$$restProps*/ ctx[4],
    		{ class: /*classes*/ ctx[1] },
    		{
    			"data-bs-popper": div_data_bs_popper_value = /*$context*/ ctx[0].inNavbar ? 'static' : undefined
    		}
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$e, 41, 0, 933);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = action_destroyer($context_popperContent_action = /*$context*/ ctx[0].popperContent(div, /*popperOptions*/ ctx[2]));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 512)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 16 && /*$$restProps*/ ctx[4],
    				(!current || dirty & /*classes*/ 2) && { class: /*classes*/ ctx[1] },
    				(!current || dirty & /*$context*/ 1 && div_data_bs_popper_value !== (div_data_bs_popper_value = /*$context*/ ctx[0].inNavbar ? 'static' : undefined)) && {
    					"data-bs-popper": div_data_bs_popper_value
    				}
    			]));

    			if ($context_popperContent_action && is_function($context_popperContent_action.update) && dirty & /*popperOptions*/ 4) $context_popperContent_action.update.call(null, /*popperOptions*/ ctx[2]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let popperOptions;
    	let classes;
    	const omit_props_names = ["class","dark","end","right"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $context;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DropdownMenu', slots, ['default']);
    	const context = getContext('dropdownContext');
    	validate_store(context, 'context');
    	component_subscribe($$self, context, value => $$invalidate(0, $context = value));
    	let { class: className = '' } = $$props;
    	let { dark = false } = $$props;
    	let { end = false } = $$props;
    	let { right = false } = $$props;

    	const popperPlacement = (direction, end) => {
    		let prefix = direction;
    		if (direction === 'up') prefix = 'top'; else if (direction === 'down') prefix = 'bottom';
    		let suffix = end ? 'end' : 'start';
    		return `${prefix}-${suffix}`;
    	};

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(4, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(5, className = $$new_props.class);
    		if ('dark' in $$new_props) $$invalidate(6, dark = $$new_props.dark);
    		if ('end' in $$new_props) $$invalidate(7, end = $$new_props.end);
    		if ('right' in $$new_props) $$invalidate(8, right = $$new_props.right);
    		if ('$$scope' in $$new_props) $$invalidate(9, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		classnames,
    		context,
    		className,
    		dark,
    		end,
    		right,
    		popperPlacement,
    		classes,
    		popperOptions,
    		$context
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(5, className = $$new_props.className);
    		if ('dark' in $$props) $$invalidate(6, dark = $$new_props.dark);
    		if ('end' in $$props) $$invalidate(7, end = $$new_props.end);
    		if ('right' in $$props) $$invalidate(8, right = $$new_props.right);
    		if ('classes' in $$props) $$invalidate(1, classes = $$new_props.classes);
    		if ('popperOptions' in $$props) $$invalidate(2, popperOptions = $$new_props.popperOptions);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$context, end, right*/ 385) {
    			$$invalidate(2, popperOptions = {
    				modifiers: [
    					{ name: 'flip' },
    					{
    						name: 'offset',
    						options: { offset: [0, 2] }
    					}
    				],
    				placement: popperPlacement($context.direction, end || right)
    			});
    		}

    		if ($$self.$$.dirty & /*className, dark, end, right, $context*/ 481) {
    			$$invalidate(1, classes = classnames(className, 'dropdown-menu', {
    				'dropdown-menu-dark': dark,
    				'dropdown-menu-end': end || right,
    				show: $context.isOpen
    			}));
    		}
    	};

    	return [
    		$context,
    		classes,
    		popperOptions,
    		context,
    		$$restProps,
    		className,
    		dark,
    		end,
    		right,
    		$$scope,
    		slots
    	];
    }

    class DropdownMenu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, { class: 5, dark: 6, end: 7, right: 8 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DropdownMenu",
    			options,
    			id: create_fragment$h.name
    		});
    	}

    	get class() {
    		throw new Error("<DropdownMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<DropdownMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dark() {
    		throw new Error("<DropdownMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dark(value) {
    		throw new Error("<DropdownMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get end() {
    		throw new Error("<DropdownMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set end(value) {
    		throw new Error("<DropdownMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get right() {
    		throw new Error("<DropdownMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set right(value) {
    		throw new Error("<DropdownMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/DropdownToggle.svelte generated by Svelte v3.48.0 */
    const file$d = "node_modules/sveltestrap/src/DropdownToggle.svelte";

    // (94:0) {:else}
    function create_else_block$3(ctx) {
    	let button;
    	let button_aria_expanded_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[20].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[19], null);
    	const default_slot_or_fallback = default_slot || fallback_block_3(ctx);

    	let button_levels = [
    		/*$$restProps*/ ctx[9],
    		{ type: "button" },
    		{
    			"aria-expanded": button_aria_expanded_value = /*$context*/ ctx[6].isOpen
    		},
    		{ class: /*btnClasses*/ ctx[5] }
    	];

    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block_1 = {
    		c: function create() {
    			button = element("button");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			set_attributes(button, button_data);
    			add_location(button, file$d, 94, 2, 1948);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(button, null);
    			}

    			if (button.autofocus) button.focus();
    			/*button_binding*/ ctx[28](button);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(/*$context*/ ctx[6].popperRef(button)),
    					listen_dev(button, "click", /*click_handler_3*/ ctx[24], false, false, false),
    					listen_dev(button, "click", /*toggleButton*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 524288)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[19],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[19])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[19], dirty, null),
    						null
    					);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*ariaLabel*/ 2)) {
    					default_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			set_attributes(button, button_data = get_spread_update(button_levels, [
    				dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9],
    				{ type: "button" },
    				(!current || dirty & /*$context*/ 64 && button_aria_expanded_value !== (button_aria_expanded_value = /*$context*/ ctx[6].isOpen)) && {
    					"aria-expanded": button_aria_expanded_value
    				},
    				(!current || dirty & /*btnClasses*/ 32) && { class: /*btnClasses*/ ctx[5] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			/*button_binding*/ ctx[28](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(94:0) {:else}",
    		ctx
    	});

    	return block_1;
    }

    // (80:25) 
    function create_if_block_2$2(ctx) {
    	let span;
    	let span_aria_expanded_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[20].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[19], null);
    	const default_slot_or_fallback = default_slot || fallback_block_2(ctx);

    	let span_levels = [
    		/*$$restProps*/ ctx[9],
    		{
    			"aria-expanded": span_aria_expanded_value = /*$context*/ ctx[6].isOpen
    		},
    		{ class: /*classes*/ ctx[4] }
    	];

    	let span_data = {};

    	for (let i = 0; i < span_levels.length; i += 1) {
    		span_data = assign(span_data, span_levels[i]);
    	}

    	const block_1 = {
    		c: function create() {
    			span = element("span");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			set_attributes(span, span_data);
    			add_location(span, file$d, 80, 2, 1673);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(span, null);
    			}

    			/*span_binding*/ ctx[27](span);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(/*$context*/ ctx[6].popperRef(span)),
    					listen_dev(span, "click", /*click_handler_2*/ ctx[23], false, false, false),
    					listen_dev(span, "click", /*toggleButton*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 524288)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[19],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[19])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[19], dirty, null),
    						null
    					);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*ariaLabel*/ 2)) {
    					default_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			set_attributes(span, span_data = get_spread_update(span_levels, [
    				dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9],
    				(!current || dirty & /*$context*/ 64 && span_aria_expanded_value !== (span_aria_expanded_value = /*$context*/ ctx[6].isOpen)) && {
    					"aria-expanded": span_aria_expanded_value
    				},
    				(!current || dirty & /*classes*/ 16) && { class: /*classes*/ ctx[4] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			/*span_binding*/ ctx[27](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(80:25) ",
    		ctx
    	});

    	return block_1;
    }

    // (66:24) 
    function create_if_block_1$2(ctx) {
    	let div;
    	let div_aria_expanded_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[20].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[19], null);
    	const default_slot_or_fallback = default_slot || fallback_block_1(ctx);

    	let div_levels = [
    		/*$$restProps*/ ctx[9],
    		{
    			"aria-expanded": div_aria_expanded_value = /*$context*/ ctx[6].isOpen
    		},
    		{ class: /*classes*/ ctx[4] }
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block_1 = {
    		c: function create() {
    			div = element("div");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			set_attributes(div, div_data);
    			add_location(div, file$d, 66, 2, 1382);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(div, null);
    			}

    			/*div_binding*/ ctx[26](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(/*$context*/ ctx[6].popperRef(div)),
    					listen_dev(div, "click", /*click_handler_1*/ ctx[22], false, false, false),
    					listen_dev(div, "click", /*toggleButton*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 524288)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[19],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[19])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[19], dirty, null),
    						null
    					);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*ariaLabel*/ 2)) {
    					default_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9],
    				(!current || dirty & /*$context*/ 64 && div_aria_expanded_value !== (div_aria_expanded_value = /*$context*/ ctx[6].isOpen)) && { "aria-expanded": div_aria_expanded_value },
    				(!current || dirty & /*classes*/ 16) && { class: /*classes*/ ctx[4] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			/*div_binding*/ ctx[26](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(66:24) ",
    		ctx
    	});

    	return block_1;
    }

    // (51:0) {#if nav}
    function create_if_block$3(ctx) {
    	let a;
    	let a_aria_expanded_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[20].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[19], null);
    	const default_slot_or_fallback = default_slot || fallback_block$2(ctx);

    	let a_levels = [
    		/*$$restProps*/ ctx[9],
    		{ href: "#nav" },
    		{
    			"aria-expanded": a_aria_expanded_value = /*$context*/ ctx[6].isOpen
    		},
    		{ class: /*classes*/ ctx[4] }
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block_1 = {
    		c: function create() {
    			a = element("a");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			set_attributes(a, a_data);
    			add_location(a, file$d, 51, 2, 1080);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(a, null);
    			}

    			/*a_binding*/ ctx[25](a);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(/*$context*/ ctx[6].popperRef(a)),
    					listen_dev(a, "click", /*click_handler*/ ctx[21], false, false, false),
    					listen_dev(a, "click", /*toggleButton*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 524288)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[19],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[19])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[19], dirty, null),
    						null
    					);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*ariaLabel*/ 2)) {
    					default_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9],
    				{ href: "#nav" },
    				(!current || dirty & /*$context*/ 64 && a_aria_expanded_value !== (a_aria_expanded_value = /*$context*/ ctx[6].isOpen)) && { "aria-expanded": a_aria_expanded_value },
    				(!current || dirty & /*classes*/ 16) && { class: /*classes*/ ctx[4] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			/*a_binding*/ ctx[25](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(51:0) {#if nav}",
    		ctx
    	});

    	return block_1;
    }

    // (105:10)        
    function fallback_block_3(ctx) {
    	let span;
    	let t;

    	const block_1 = {
    		c: function create() {
    			span = element("span");
    			t = text(/*ariaLabel*/ ctx[1]);
    			attr_dev(span, "class", "visually-hidden");
    			add_location(span, file$d, 105, 6, 2165);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*ariaLabel*/ 2) set_data_dev(t, /*ariaLabel*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: fallback_block_3.name,
    		type: "fallback",
    		source: "(105:10)        ",
    		ctx
    	});

    	return block_1;
    }

    // (90:10)        
    function fallback_block_2(ctx) {
    	let span;
    	let t;

    	const block_1 = {
    		c: function create() {
    			span = element("span");
    			t = text(/*ariaLabel*/ ctx[1]);
    			attr_dev(span, "class", "visually-hidden");
    			add_location(span, file$d, 90, 6, 1867);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*ariaLabel*/ 2) set_data_dev(t, /*ariaLabel*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: fallback_block_2.name,
    		type: "fallback",
    		source: "(90:10)        ",
    		ctx
    	});

    	return block_1;
    }

    // (76:10)        
    function fallback_block_1(ctx) {
    	let span;
    	let t;

    	const block_1 = {
    		c: function create() {
    			span = element("span");
    			t = text(/*ariaLabel*/ ctx[1]);
    			attr_dev(span, "class", "visually-hidden");
    			add_location(span, file$d, 76, 6, 1575);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*ariaLabel*/ 2) set_data_dev(t, /*ariaLabel*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: fallback_block_1.name,
    		type: "fallback",
    		source: "(76:10)        ",
    		ctx
    	});

    	return block_1;
    }

    // (62:10)        
    function fallback_block$2(ctx) {
    	let span;
    	let t;

    	const block_1 = {
    		c: function create() {
    			span = element("span");
    			t = text(/*ariaLabel*/ ctx[1]);
    			attr_dev(span, "class", "visually-hidden");
    			add_location(span, file$d, 62, 6, 1287);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*ariaLabel*/ 2) set_data_dev(t, /*ariaLabel*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: fallback_block$2.name,
    		type: "fallback",
    		source: "(62:10)        ",
    		ctx
    	});

    	return block_1;
    }

    function create_fragment$g(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$3, create_if_block_1$2, create_if_block_2$2, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*nav*/ ctx[2]) return 0;
    		if (/*tag*/ ctx[3] === 'div') return 1;
    		if (/*tag*/ ctx[3] === 'span') return 2;
    		return 3;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block_1 = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block_1;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let classes;
    	let btnClasses;

    	const omit_props_names = [
    		"class","ariaLabel","active","block","caret","color","disabled","inner","nav","outline","size","split","tag"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $context;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DropdownToggle', slots, ['default']);
    	const context = getContext('dropdownContext');
    	validate_store(context, 'context');
    	component_subscribe($$self, context, value => $$invalidate(6, $context = value));
    	let { class: className = '' } = $$props;
    	let { ariaLabel = 'Toggle Dropdown' } = $$props;
    	let { active = false } = $$props;
    	let { block = false } = $$props;
    	let { caret = false } = $$props;
    	let { color = 'secondary' } = $$props;
    	let { disabled = false } = $$props;
    	let { inner = undefined } = $$props;
    	let { nav = false } = $$props;
    	let { outline = false } = $$props;
    	let { size = '' } = $$props;
    	let { split = false } = $$props;
    	let { tag = null } = $$props;

    	function toggleButton(e) {
    		if (disabled) {
    			e.preventDefault();
    			return;
    		}

    		if (nav) {
    			e.preventDefault();
    		}

    		$context.toggle(e);
    	}

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler_3(event) {
    		bubble.call(this, $$self, event);
    	}

    	function a_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(0, inner);
    		});
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(0, inner);
    		});
    	}

    	function span_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(0, inner);
    		});
    	}

    	function button_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(0, inner);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(9, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(10, className = $$new_props.class);
    		if ('ariaLabel' in $$new_props) $$invalidate(1, ariaLabel = $$new_props.ariaLabel);
    		if ('active' in $$new_props) $$invalidate(11, active = $$new_props.active);
    		if ('block' in $$new_props) $$invalidate(12, block = $$new_props.block);
    		if ('caret' in $$new_props) $$invalidate(13, caret = $$new_props.caret);
    		if ('color' in $$new_props) $$invalidate(14, color = $$new_props.color);
    		if ('disabled' in $$new_props) $$invalidate(15, disabled = $$new_props.disabled);
    		if ('inner' in $$new_props) $$invalidate(0, inner = $$new_props.inner);
    		if ('nav' in $$new_props) $$invalidate(2, nav = $$new_props.nav);
    		if ('outline' in $$new_props) $$invalidate(16, outline = $$new_props.outline);
    		if ('size' in $$new_props) $$invalidate(17, size = $$new_props.size);
    		if ('split' in $$new_props) $$invalidate(18, split = $$new_props.split);
    		if ('tag' in $$new_props) $$invalidate(3, tag = $$new_props.tag);
    		if ('$$scope' in $$new_props) $$invalidate(19, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		classnames,
    		context,
    		className,
    		ariaLabel,
    		active,
    		block,
    		caret,
    		color,
    		disabled,
    		inner,
    		nav,
    		outline,
    		size,
    		split,
    		tag,
    		toggleButton,
    		classes,
    		btnClasses,
    		$context
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(10, className = $$new_props.className);
    		if ('ariaLabel' in $$props) $$invalidate(1, ariaLabel = $$new_props.ariaLabel);
    		if ('active' in $$props) $$invalidate(11, active = $$new_props.active);
    		if ('block' in $$props) $$invalidate(12, block = $$new_props.block);
    		if ('caret' in $$props) $$invalidate(13, caret = $$new_props.caret);
    		if ('color' in $$props) $$invalidate(14, color = $$new_props.color);
    		if ('disabled' in $$props) $$invalidate(15, disabled = $$new_props.disabled);
    		if ('inner' in $$props) $$invalidate(0, inner = $$new_props.inner);
    		if ('nav' in $$props) $$invalidate(2, nav = $$new_props.nav);
    		if ('outline' in $$props) $$invalidate(16, outline = $$new_props.outline);
    		if ('size' in $$props) $$invalidate(17, size = $$new_props.size);
    		if ('split' in $$props) $$invalidate(18, split = $$new_props.split);
    		if ('tag' in $$props) $$invalidate(3, tag = $$new_props.tag);
    		if ('classes' in $$props) $$invalidate(4, classes = $$new_props.classes);
    		if ('btnClasses' in $$props) $$invalidate(5, btnClasses = $$new_props.btnClasses);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, caret, split, nav*/ 271364) {
    			$$invalidate(4, classes = classnames(className, {
    				'dropdown-toggle': caret || split,
    				'dropdown-toggle-split': split,
    				'nav-link': nav
    			}));
    		}

    		if ($$self.$$.dirty & /*classes, outline, color, size, block, active*/ 219152) {
    			$$invalidate(5, btnClasses = classnames(classes, 'btn', `btn${outline ? '-outline' : ''}-${color}`, size ? `btn-${size}` : false, block ? 'd-block w-100' : false, { active }));
    		}
    	};

    	return [
    		inner,
    		ariaLabel,
    		nav,
    		tag,
    		classes,
    		btnClasses,
    		$context,
    		context,
    		toggleButton,
    		$$restProps,
    		className,
    		active,
    		block,
    		caret,
    		color,
    		disabled,
    		outline,
    		size,
    		split,
    		$$scope,
    		slots,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		a_binding,
    		div_binding,
    		span_binding,
    		button_binding
    	];
    }

    class DropdownToggle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {
    			class: 10,
    			ariaLabel: 1,
    			active: 11,
    			block: 12,
    			caret: 13,
    			color: 14,
    			disabled: 15,
    			inner: 0,
    			nav: 2,
    			outline: 16,
    			size: 17,
    			split: 18,
    			tag: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DropdownToggle",
    			options,
    			id: create_fragment$g.name
    		});
    	}

    	get class() {
    		throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaLabel() {
    		throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaLabel(value) {
    		throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get block() {
    		throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set block(value) {
    		throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get caret() {
    		throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set caret(value) {
    		throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inner() {
    		throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inner(value) {
    		throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get nav() {
    		throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nav(value) {
    		throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outline() {
    		throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outline(value) {
    		throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get split() {
    		throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set split(value) {
    		throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tag() {
    		throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tag(value) {
    		throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/FormCheck.svelte generated by Svelte v3.48.0 */
    const file$c = "node_modules/sveltestrap/src/FormCheck.svelte";
    const get_label_slot_changes = dirty => ({});
    const get_label_slot_context = ctx => ({});

    // (66:2) {:else}
    function create_else_block$2(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[11],
    		{ class: /*inputClasses*/ ctx[9] },
    		{ id: /*idFor*/ ctx[8] },
    		{ type: "checkbox" },
    		{ disabled: /*disabled*/ ctx[3] },
    		{ name: /*name*/ ctx[5] },
    		{ __value: /*value*/ ctx[7] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$c, 66, 4, 1386);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			input.checked = /*checked*/ ctx[0];
    			/*input_binding_2*/ ctx[38](input);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_2*/ ctx[28], false, false, false),
    					listen_dev(input, "change", /*change_handler_2*/ ctx[29], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_2*/ ctx[30], false, false, false),
    					listen_dev(input, "input", /*input_handler_2*/ ctx[31], false, false, false),
    					listen_dev(input, "change", /*input_change_handler_2*/ ctx[37])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 2048 && /*$$restProps*/ ctx[11],
    				dirty[0] & /*inputClasses*/ 512 && { class: /*inputClasses*/ ctx[9] },
    				dirty[0] & /*idFor*/ 256 && { id: /*idFor*/ ctx[8] },
    				{ type: "checkbox" },
    				dirty[0] & /*disabled*/ 8 && { disabled: /*disabled*/ ctx[3] },
    				dirty[0] & /*name*/ 32 && { name: /*name*/ ctx[5] },
    				dirty[0] & /*value*/ 128 && { __value: /*value*/ ctx[7] }
    			]));

    			if (dirty[0] & /*checked*/ 1) {
    				input.checked = /*checked*/ ctx[0];
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			/*input_binding_2*/ ctx[38](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(66:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (50:30) 
    function create_if_block_2$1(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[11],
    		{ class: /*inputClasses*/ ctx[9] },
    		{ id: /*idFor*/ ctx[8] },
    		{ type: "checkbox" },
    		{ disabled: /*disabled*/ ctx[3] },
    		{ name: /*name*/ ctx[5] },
    		{ __value: /*value*/ ctx[7] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$c, 50, 4, 1122);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			input.checked = /*checked*/ ctx[0];
    			/*input_binding_1*/ ctx[36](input);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_1*/ ctx[24], false, false, false),
    					listen_dev(input, "change", /*change_handler_1*/ ctx[25], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_1*/ ctx[26], false, false, false),
    					listen_dev(input, "input", /*input_handler_1*/ ctx[27], false, false, false),
    					listen_dev(input, "change", /*input_change_handler_1*/ ctx[35])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 2048 && /*$$restProps*/ ctx[11],
    				dirty[0] & /*inputClasses*/ 512 && { class: /*inputClasses*/ ctx[9] },
    				dirty[0] & /*idFor*/ 256 && { id: /*idFor*/ ctx[8] },
    				{ type: "checkbox" },
    				dirty[0] & /*disabled*/ 8 && { disabled: /*disabled*/ ctx[3] },
    				dirty[0] & /*name*/ 32 && { name: /*name*/ ctx[5] },
    				dirty[0] & /*value*/ 128 && { __value: /*value*/ ctx[7] }
    			]));

    			if (dirty[0] & /*checked*/ 1) {
    				input.checked = /*checked*/ ctx[0];
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			/*input_binding_1*/ ctx[36](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(50:30) ",
    		ctx
    	});

    	return block;
    }

    // (34:2) {#if type === 'radio'}
    function create_if_block_1$1(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[11],
    		{ class: /*inputClasses*/ ctx[9] },
    		{ id: /*idFor*/ ctx[8] },
    		{ type: "radio" },
    		{ disabled: /*disabled*/ ctx[3] },
    		{ name: /*name*/ ctx[5] },
    		{ __value: /*value*/ ctx[7] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			/*$$binding_groups*/ ctx[33][0].push(input);
    			add_location(input, file$c, 34, 4, 842);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			input.checked = input.__value === /*group*/ ctx[1];
    			/*input_binding*/ ctx[34](input);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler*/ ctx[20], false, false, false),
    					listen_dev(input, "change", /*change_handler*/ ctx[21], false, false, false),
    					listen_dev(input, "focus", /*focus_handler*/ ctx[22], false, false, false),
    					listen_dev(input, "input", /*input_handler*/ ctx[23], false, false, false),
    					listen_dev(input, "change", /*input_change_handler*/ ctx[32])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 2048 && /*$$restProps*/ ctx[11],
    				dirty[0] & /*inputClasses*/ 512 && { class: /*inputClasses*/ ctx[9] },
    				dirty[0] & /*idFor*/ 256 && { id: /*idFor*/ ctx[8] },
    				{ type: "radio" },
    				dirty[0] & /*disabled*/ 8 && { disabled: /*disabled*/ ctx[3] },
    				dirty[0] & /*name*/ 32 && { name: /*name*/ ctx[5] },
    				dirty[0] & /*value*/ 128 && { __value: /*value*/ ctx[7] }
    			]));

    			if (dirty[0] & /*group*/ 2) {
    				input.checked = input.__value === /*group*/ ctx[1];
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			/*$$binding_groups*/ ctx[33][0].splice(/*$$binding_groups*/ ctx[33][0].indexOf(input), 1);
    			/*input_binding*/ ctx[34](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(34:2) {#if type === 'radio'}",
    		ctx
    	});

    	return block;
    }

    // (83:2) {#if label}
    function create_if_block$2(ctx) {
    	let label_1;
    	let current;
    	const label_slot_template = /*#slots*/ ctx[19].label;
    	const label_slot = create_slot(label_slot_template, ctx, /*$$scope*/ ctx[18], get_label_slot_context);
    	const label_slot_or_fallback = label_slot || fallback_block$1(ctx);

    	const block = {
    		c: function create() {
    			label_1 = element("label");
    			if (label_slot_or_fallback) label_slot_or_fallback.c();
    			attr_dev(label_1, "class", "form-check-label");
    			attr_dev(label_1, "for", /*idFor*/ ctx[8]);
    			add_location(label_1, file$c, 83, 4, 1662);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label_1, anchor);

    			if (label_slot_or_fallback) {
    				label_slot_or_fallback.m(label_1, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (label_slot) {
    				if (label_slot.p && (!current || dirty[0] & /*$$scope*/ 262144)) {
    					update_slot_base(
    						label_slot,
    						label_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(label_slot_template, /*$$scope*/ ctx[18], dirty, get_label_slot_changes),
    						get_label_slot_context
    					);
    				}
    			} else {
    				if (label_slot_or_fallback && label_slot_or_fallback.p && (!current || dirty[0] & /*label*/ 16)) {
    					label_slot_or_fallback.p(ctx, !current ? [-1, -1] : dirty);
    				}
    			}

    			if (!current || dirty[0] & /*idFor*/ 256) {
    				attr_dev(label_1, "for", /*idFor*/ ctx[8]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label_1);
    			if (label_slot_or_fallback) label_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(83:2) {#if label}",
    		ctx
    	});

    	return block;
    }

    // (85:25) {label}
    function fallback_block$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*label*/ ctx[4]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*label*/ 16) set_data_dev(t, /*label*/ ctx[4]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$1.name,
    		type: "fallback",
    		source: "(85:25) {label}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let div;
    	let t;
    	let current;

    	function select_block_type(ctx, dirty) {
    		if (/*type*/ ctx[6] === 'radio') return create_if_block_1$1;
    		if (/*type*/ ctx[6] === 'switch') return create_if_block_2$1;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*label*/ ctx[4] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			attr_dev(div, "class", /*classes*/ ctx[10]);
    			add_location(div, file$c, 32, 0, 791);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_block0.m(div, null);
    			append_dev(div, t);
    			if (if_block1) if_block1.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div, t);
    				}
    			}

    			if (/*label*/ ctx[4]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*label*/ 16) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$2(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty[0] & /*classes*/ 1024) {
    				attr_dev(div, "class", /*classes*/ ctx[10]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let classes;
    	let inputClasses;
    	let idFor;

    	const omit_props_names = [
    		"class","checked","disabled","group","id","inline","inner","invalid","label","name","size","type","valid","value"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FormCheck', slots, ['label']);
    	let { class: className = '' } = $$props;
    	let { checked = false } = $$props;
    	let { disabled = false } = $$props;
    	let { group = undefined } = $$props;
    	let { id = undefined } = $$props;
    	let { inline = false } = $$props;
    	let { inner = undefined } = $$props;
    	let { invalid = false } = $$props;
    	let { label = '' } = $$props;
    	let { name = '' } = $$props;
    	let { size = '' } = $$props;
    	let { type = 'checkbox' } = $$props;
    	let { valid = false } = $$props;
    	let { value = undefined } = $$props;
    	const $$binding_groups = [[]];

    	function blur_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_change_handler() {
    		group = this.__value;
    		$$invalidate(1, group);
    	}

    	function input_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(2, inner);
    		});
    	}

    	function input_change_handler_1() {
    		checked = this.checked;
    		$$invalidate(0, checked);
    	}

    	function input_binding_1($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(2, inner);
    		});
    	}

    	function input_change_handler_2() {
    		checked = this.checked;
    		$$invalidate(0, checked);
    	}

    	function input_binding_2($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(2, inner);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(11, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(12, className = $$new_props.class);
    		if ('checked' in $$new_props) $$invalidate(0, checked = $$new_props.checked);
    		if ('disabled' in $$new_props) $$invalidate(3, disabled = $$new_props.disabled);
    		if ('group' in $$new_props) $$invalidate(1, group = $$new_props.group);
    		if ('id' in $$new_props) $$invalidate(13, id = $$new_props.id);
    		if ('inline' in $$new_props) $$invalidate(14, inline = $$new_props.inline);
    		if ('inner' in $$new_props) $$invalidate(2, inner = $$new_props.inner);
    		if ('invalid' in $$new_props) $$invalidate(15, invalid = $$new_props.invalid);
    		if ('label' in $$new_props) $$invalidate(4, label = $$new_props.label);
    		if ('name' in $$new_props) $$invalidate(5, name = $$new_props.name);
    		if ('size' in $$new_props) $$invalidate(16, size = $$new_props.size);
    		if ('type' in $$new_props) $$invalidate(6, type = $$new_props.type);
    		if ('valid' in $$new_props) $$invalidate(17, valid = $$new_props.valid);
    		if ('value' in $$new_props) $$invalidate(7, value = $$new_props.value);
    		if ('$$scope' in $$new_props) $$invalidate(18, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		checked,
    		disabled,
    		group,
    		id,
    		inline,
    		inner,
    		invalid,
    		label,
    		name,
    		size,
    		type,
    		valid,
    		value,
    		idFor,
    		inputClasses,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(12, className = $$new_props.className);
    		if ('checked' in $$props) $$invalidate(0, checked = $$new_props.checked);
    		if ('disabled' in $$props) $$invalidate(3, disabled = $$new_props.disabled);
    		if ('group' in $$props) $$invalidate(1, group = $$new_props.group);
    		if ('id' in $$props) $$invalidate(13, id = $$new_props.id);
    		if ('inline' in $$props) $$invalidate(14, inline = $$new_props.inline);
    		if ('inner' in $$props) $$invalidate(2, inner = $$new_props.inner);
    		if ('invalid' in $$props) $$invalidate(15, invalid = $$new_props.invalid);
    		if ('label' in $$props) $$invalidate(4, label = $$new_props.label);
    		if ('name' in $$props) $$invalidate(5, name = $$new_props.name);
    		if ('size' in $$props) $$invalidate(16, size = $$new_props.size);
    		if ('type' in $$props) $$invalidate(6, type = $$new_props.type);
    		if ('valid' in $$props) $$invalidate(17, valid = $$new_props.valid);
    		if ('value' in $$props) $$invalidate(7, value = $$new_props.value);
    		if ('idFor' in $$props) $$invalidate(8, idFor = $$new_props.idFor);
    		if ('inputClasses' in $$props) $$invalidate(9, inputClasses = $$new_props.inputClasses);
    		if ('classes' in $$props) $$invalidate(10, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*className, type, inline, size*/ 86080) {
    			$$invalidate(10, classes = classnames(className, 'form-check', {
    				'form-switch': type === 'switch',
    				'form-check-inline': inline,
    				[`form-control-${size}`]: size
    			}));
    		}

    		if ($$self.$$.dirty[0] & /*invalid, valid*/ 163840) {
    			$$invalidate(9, inputClasses = classnames('form-check-input', { 'is-invalid': invalid, 'is-valid': valid }));
    		}

    		if ($$self.$$.dirty[0] & /*id, label*/ 8208) {
    			$$invalidate(8, idFor = id || label);
    		}
    	};

    	return [
    		checked,
    		group,
    		inner,
    		disabled,
    		label,
    		name,
    		type,
    		value,
    		idFor,
    		inputClasses,
    		classes,
    		$$restProps,
    		className,
    		id,
    		inline,
    		invalid,
    		size,
    		valid,
    		$$scope,
    		slots,
    		blur_handler,
    		change_handler,
    		focus_handler,
    		input_handler,
    		blur_handler_1,
    		change_handler_1,
    		focus_handler_1,
    		input_handler_1,
    		blur_handler_2,
    		change_handler_2,
    		focus_handler_2,
    		input_handler_2,
    		input_change_handler,
    		$$binding_groups,
    		input_binding,
    		input_change_handler_1,
    		input_binding_1,
    		input_change_handler_2,
    		input_binding_2
    	];
    }

    class FormCheck extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$f,
    			create_fragment$f,
    			safe_not_equal,
    			{
    				class: 12,
    				checked: 0,
    				disabled: 3,
    				group: 1,
    				id: 13,
    				inline: 14,
    				inner: 2,
    				invalid: 15,
    				label: 4,
    				name: 5,
    				size: 16,
    				type: 6,
    				valid: 17,
    				value: 7
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FormCheck",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get class() {
    		throw new Error("<FormCheck>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<FormCheck>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get checked() {
    		throw new Error("<FormCheck>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set checked(value) {
    		throw new Error("<FormCheck>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<FormCheck>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<FormCheck>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get group() {
    		throw new Error("<FormCheck>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set group(value) {
    		throw new Error("<FormCheck>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<FormCheck>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<FormCheck>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inline() {
    		throw new Error("<FormCheck>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inline(value) {
    		throw new Error("<FormCheck>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inner() {
    		throw new Error("<FormCheck>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inner(value) {
    		throw new Error("<FormCheck>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get invalid() {
    		throw new Error("<FormCheck>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set invalid(value) {
    		throw new Error("<FormCheck>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<FormCheck>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<FormCheck>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<FormCheck>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<FormCheck>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<FormCheck>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<FormCheck>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<FormCheck>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<FormCheck>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get valid() {
    		throw new Error("<FormCheck>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set valid(value) {
    		throw new Error("<FormCheck>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<FormCheck>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<FormCheck>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/FormFeedback.svelte generated by Svelte v3.48.0 */
    const file$b = "node_modules/sveltestrap/src/FormFeedback.svelte";

    function create_fragment$e(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);
    	let div_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$b, 19, 0, 368);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	const omit_props_names = ["class","valid","tooltip"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FormFeedback', slots, ['default']);
    	let { class: className = '' } = $$props;
    	let { valid = undefined } = $$props;
    	let { tooltip = false } = $$props;
    	let classes;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('valid' in $$new_props) $$invalidate(3, valid = $$new_props.valid);
    		if ('tooltip' in $$new_props) $$invalidate(4, tooltip = $$new_props.tooltip);
    		if ('$$scope' in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		valid,
    		tooltip,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(2, className = $$new_props.className);
    		if ('valid' in $$props) $$invalidate(3, valid = $$new_props.valid);
    		if ('tooltip' in $$props) $$invalidate(4, tooltip = $$new_props.tooltip);
    		if ('classes' in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*tooltip, className, valid*/ 28) {
    			{
    				const validMode = tooltip ? 'tooltip' : 'feedback';
    				$$invalidate(0, classes = classnames(className, valid ? `valid-${validMode}` : `invalid-${validMode}`));
    			}
    		}
    	};

    	return [classes, $$restProps, className, valid, tooltip, $$scope, slots];
    }

    class FormFeedback extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { class: 2, valid: 3, tooltip: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FormFeedback",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get class() {
    		throw new Error("<FormFeedback>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<FormFeedback>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get valid() {
    		throw new Error("<FormFeedback>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set valid(value) {
    		throw new Error("<FormFeedback>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tooltip() {
    		throw new Error("<FormFeedback>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tooltip(value) {
    		throw new Error("<FormFeedback>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/Input.svelte generated by Svelte v3.48.0 */
    const file$a = "node_modules/sveltestrap/src/Input.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[210] = list[i];
    	return child_ctx;
    }

    // (490:40) 
    function create_if_block_22(ctx) {
    	let select;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[24].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[209], null);

    	let select_levels = [
    		/*$$restProps*/ ctx[21],
    		{ class: /*classes*/ ctx[18] },
    		{ name: /*name*/ ctx[13] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ readonly: /*readonly*/ ctx[15] }
    	];

    	let select_data = {};

    	for (let i = 0; i < select_levels.length; i += 1) {
    		select_data = assign(select_data, select_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			select = element("select");
    			if (default_slot) default_slot.c();
    			set_attributes(select, select_data);
    			if (/*value*/ ctx[6] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[207].call(select));
    			add_location(select, file$a, 490, 2, 9190);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, select, anchor);

    			if (default_slot) {
    				default_slot.m(select, null);
    			}

    			(select_data.multiple ? select_options : select_option)(select, select_data.value);
    			if (select.autofocus) select.focus();
    			select_option(select, /*value*/ ctx[6]);
    			/*select_binding*/ ctx[208](select);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(select, "blur", /*blur_handler_20*/ ctx[156], false, false, false),
    					listen_dev(select, "change", /*change_handler_19*/ ctx[157], false, false, false),
    					listen_dev(select, "focus", /*focus_handler_20*/ ctx[158], false, false, false),
    					listen_dev(select, "input", /*input_handler_19*/ ctx[159], false, false, false),
    					listen_dev(select, "change", /*select_change_handler*/ ctx[207])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[6] & /*$$scope*/ 8388608)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[209],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[209])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[209], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(select, select_data = get_spread_update(select_levels, [
    				dirty[0] & /*$$restProps*/ 2097152 && /*$$restProps*/ ctx[21],
    				(!current || dirty[0] & /*classes*/ 262144) && { class: /*classes*/ ctx[18] },
    				(!current || dirty[0] & /*name*/ 8192) && { name: /*name*/ ctx[13] },
    				(!current || dirty[0] & /*disabled*/ 256) && { disabled: /*disabled*/ ctx[8] },
    				(!current || dirty[0] & /*readonly*/ 32768) && { readonly: /*readonly*/ ctx[15] }
    			]));

    			if (dirty[0] & /*$$restProps, classes, name, disabled, readonly*/ 2400512 && 'value' in select_data) (select_data.multiple ? select_options : select_option)(select, select_data.value);

    			if (dirty[0] & /*value*/ 64) {
    				select_option(select, /*value*/ ctx[6]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(select);
    			if (default_slot) default_slot.d(detaching);
    			/*select_binding*/ ctx[208](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_22.name,
    		type: "if",
    		source: "(490:40) ",
    		ctx
    	});

    	return block;
    }

    // (472:29) 
    function create_if_block_21(ctx) {
    	let textarea;
    	let mounted;
    	let dispose;

    	let textarea_levels = [
    		/*$$restProps*/ ctx[21],
    		{ class: /*classes*/ ctx[18] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ name: /*name*/ ctx[13] },
    		{ placeholder: /*placeholder*/ ctx[14] },
    		{ readOnly: /*readonly*/ ctx[15] }
    	];

    	let textarea_data = {};

    	for (let i = 0; i < textarea_levels.length; i += 1) {
    		textarea_data = assign(textarea_data, textarea_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			textarea = element("textarea");
    			set_attributes(textarea, textarea_data);
    			add_location(textarea, file$a, 472, 2, 8899);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, textarea, anchor);
    			if (textarea.autofocus) textarea.focus();
    			set_input_value(textarea, /*value*/ ctx[6]);
    			/*textarea_binding*/ ctx[206](textarea);

    			if (!mounted) {
    				dispose = [
    					listen_dev(textarea, "blur", /*blur_handler_19*/ ctx[149], false, false, false),
    					listen_dev(textarea, "change", /*change_handler_18*/ ctx[150], false, false, false),
    					listen_dev(textarea, "focus", /*focus_handler_19*/ ctx[151], false, false, false),
    					listen_dev(textarea, "input", /*input_handler_18*/ ctx[152], false, false, false),
    					listen_dev(textarea, "keydown", /*keydown_handler_19*/ ctx[153], false, false, false),
    					listen_dev(textarea, "keypress", /*keypress_handler_19*/ ctx[154], false, false, false),
    					listen_dev(textarea, "keyup", /*keyup_handler_19*/ ctx[155], false, false, false),
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[205])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(textarea, textarea_data = get_spread_update(textarea_levels, [
    				dirty[0] & /*$$restProps*/ 2097152 && /*$$restProps*/ ctx[21],
    				dirty[0] & /*classes*/ 262144 && { class: /*classes*/ ctx[18] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*name*/ 8192 && { name: /*name*/ ctx[13] },
    				dirty[0] & /*placeholder*/ 16384 && { placeholder: /*placeholder*/ ctx[14] },
    				dirty[0] & /*readonly*/ 32768 && { readOnly: /*readonly*/ ctx[15] }
    			]));

    			if (dirty[0] & /*value*/ 64) {
    				set_input_value(textarea, /*value*/ ctx[6]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(textarea);
    			/*textarea_binding*/ ctx[206](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_21.name,
    		type: "if",
    		source: "(472:29) ",
    		ctx
    	});

    	return block;
    }

    // (93:0) {#if tag === 'input'}
    function create_if_block_2(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;

    	const if_block_creators = [
    		create_if_block_3,
    		create_if_block_4,
    		create_if_block_5,
    		create_if_block_6,
    		create_if_block_7,
    		create_if_block_8,
    		create_if_block_9,
    		create_if_block_10,
    		create_if_block_11,
    		create_if_block_12,
    		create_if_block_13,
    		create_if_block_14,
    		create_if_block_15,
    		create_if_block_16,
    		create_if_block_17,
    		create_if_block_18,
    		create_if_block_19,
    		create_if_block_20,
    		create_else_block_1
    	];

    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*type*/ ctx[16] === 'text') return 0;
    		if (/*type*/ ctx[16] === 'password') return 1;
    		if (/*type*/ ctx[16] === 'color') return 2;
    		if (/*type*/ ctx[16] === 'email') return 3;
    		if (/*type*/ ctx[16] === 'file') return 4;
    		if (/*type*/ ctx[16] === 'checkbox' || /*type*/ ctx[16] === 'radio' || /*type*/ ctx[16] === 'switch') return 5;
    		if (/*type*/ ctx[16] === 'url') return 6;
    		if (/*type*/ ctx[16] === 'number') return 7;
    		if (/*type*/ ctx[16] === 'date') return 8;
    		if (/*type*/ ctx[16] === 'time') return 9;
    		if (/*type*/ ctx[16] === 'datetime') return 10;
    		if (/*type*/ ctx[16] === 'datetime-local') return 11;
    		if (/*type*/ ctx[16] === 'month') return 12;
    		if (/*type*/ ctx[16] === 'color') return 13;
    		if (/*type*/ ctx[16] === 'range') return 14;
    		if (/*type*/ ctx[16] === 'search') return 15;
    		if (/*type*/ ctx[16] === 'tel') return 16;
    		if (/*type*/ ctx[16] === 'week') return 17;
    		return 18;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(93:0) {#if tag === 'input'}",
    		ctx
    	});

    	return block;
    }

    // (453:2) {:else}
    function create_else_block_1(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[21],
    		{ type: /*type*/ ctx[16] },
    		{ readOnly: /*readonly*/ ctx[15] },
    		{ class: /*classes*/ ctx[18] },
    		{ name: /*name*/ ctx[13] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[14] },
    		{ value: /*value*/ ctx[6] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$a, 453, 4, 8568);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			input.value = input_data.value;
    			if (input.autofocus) input.focus();

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_18*/ ctx[144], false, false, false),
    					listen_dev(input, "change", /*handleInput*/ ctx[20], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_18*/ ctx[145], false, false, false),
    					listen_dev(input, "input", /*handleInput*/ ctx[20], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_18*/ ctx[146], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_18*/ ctx[147], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_18*/ ctx[148], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 2097152 && /*$$restProps*/ ctx[21],
    				dirty[0] & /*type*/ 65536 && { type: /*type*/ ctx[16] },
    				dirty[0] & /*readonly*/ 32768 && { readOnly: /*readonly*/ ctx[15] },
    				dirty[0] & /*classes*/ 262144 && { class: /*classes*/ ctx[18] },
    				dirty[0] & /*name*/ 8192 && { name: /*name*/ ctx[13] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 16384 && { placeholder: /*placeholder*/ ctx[14] },
    				dirty[0] & /*value*/ 64 && input.value !== /*value*/ ctx[6] && { value: /*value*/ ctx[6] }
    			]));

    			if ('value' in input_data) {
    				input.value = input_data.value;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(453:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (434:28) 
    function create_if_block_20(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[21],
    		{ class: /*classes*/ ctx[18] },
    		{ type: "week" },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ name: /*name*/ ctx[13] },
    		{ placeholder: /*placeholder*/ ctx[14] },
    		{ readOnly: /*readonly*/ ctx[15] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$a, 434, 4, 8259);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[6]);
    			/*input_binding_16*/ ctx[204](input);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_17*/ ctx[137], false, false, false),
    					listen_dev(input, "change", /*change_handler_17*/ ctx[138], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_17*/ ctx[139], false, false, false),
    					listen_dev(input, "input", /*input_handler_17*/ ctx[140], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_17*/ ctx[141], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_17*/ ctx[142], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_17*/ ctx[143], false, false, false),
    					listen_dev(input, "input", /*input_input_handler_14*/ ctx[203])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 2097152 && /*$$restProps*/ ctx[21],
    				dirty[0] & /*classes*/ 262144 && { class: /*classes*/ ctx[18] },
    				{ type: "week" },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*name*/ 8192 && { name: /*name*/ ctx[13] },
    				dirty[0] & /*placeholder*/ 16384 && { placeholder: /*placeholder*/ ctx[14] },
    				dirty[0] & /*readonly*/ 32768 && { readOnly: /*readonly*/ ctx[15] }
    			]));

    			if (dirty[0] & /*value*/ 64) {
    				set_input_value(input, /*value*/ ctx[6]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			/*input_binding_16*/ ctx[204](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_20.name,
    		type: "if",
    		source: "(434:28) ",
    		ctx
    	});

    	return block;
    }

    // (414:27) 
    function create_if_block_19(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[21],
    		{ class: /*classes*/ ctx[18] },
    		{ type: "tel" },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ name: /*name*/ ctx[13] },
    		{ placeholder: /*placeholder*/ ctx[14] },
    		{ readOnly: /*readonly*/ ctx[15] },
    		{ size: /*size*/ ctx[1] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$a, 414, 4, 7919);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[6]);
    			/*input_binding_15*/ ctx[202](input);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_16*/ ctx[130], false, false, false),
    					listen_dev(input, "change", /*change_handler_16*/ ctx[131], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_16*/ ctx[132], false, false, false),
    					listen_dev(input, "input", /*input_handler_16*/ ctx[133], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_16*/ ctx[134], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_16*/ ctx[135], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_16*/ ctx[136], false, false, false),
    					listen_dev(input, "input", /*input_input_handler_13*/ ctx[201])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 2097152 && /*$$restProps*/ ctx[21],
    				dirty[0] & /*classes*/ 262144 && { class: /*classes*/ ctx[18] },
    				{ type: "tel" },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*name*/ 8192 && { name: /*name*/ ctx[13] },
    				dirty[0] & /*placeholder*/ 16384 && { placeholder: /*placeholder*/ ctx[14] },
    				dirty[0] & /*readonly*/ 32768 && { readOnly: /*readonly*/ ctx[15] },
    				dirty[0] & /*size*/ 2 && { size: /*size*/ ctx[1] }
    			]));

    			if (dirty[0] & /*value*/ 64) {
    				set_input_value(input, /*value*/ ctx[6]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			/*input_binding_15*/ ctx[202](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_19.name,
    		type: "if",
    		source: "(414:27) ",
    		ctx
    	});

    	return block;
    }

    // (394:30) 
    function create_if_block_18(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[21],
    		{ class: /*classes*/ ctx[18] },
    		{ type: "search" },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ name: /*name*/ ctx[13] },
    		{ placeholder: /*placeholder*/ ctx[14] },
    		{ readOnly: /*readonly*/ ctx[15] },
    		{ size: /*size*/ ctx[1] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$a, 394, 4, 7577);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[6]);
    			/*input_binding_14*/ ctx[200](input);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_15*/ ctx[123], false, false, false),
    					listen_dev(input, "change", /*change_handler_15*/ ctx[124], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_15*/ ctx[125], false, false, false),
    					listen_dev(input, "input", /*input_handler_15*/ ctx[126], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_15*/ ctx[127], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_15*/ ctx[128], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_15*/ ctx[129], false, false, false),
    					listen_dev(input, "input", /*input_input_handler_12*/ ctx[199])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 2097152 && /*$$restProps*/ ctx[21],
    				dirty[0] & /*classes*/ 262144 && { class: /*classes*/ ctx[18] },
    				{ type: "search" },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*name*/ 8192 && { name: /*name*/ ctx[13] },
    				dirty[0] & /*placeholder*/ 16384 && { placeholder: /*placeholder*/ ctx[14] },
    				dirty[0] & /*readonly*/ 32768 && { readOnly: /*readonly*/ ctx[15] },
    				dirty[0] & /*size*/ 2 && { size: /*size*/ ctx[1] }
    			]));

    			if (dirty[0] & /*value*/ 64) {
    				set_input_value(input, /*value*/ ctx[6]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			/*input_binding_14*/ ctx[200](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_18.name,
    		type: "if",
    		source: "(394:30) ",
    		ctx
    	});

    	return block;
    }

    // (375:29) 
    function create_if_block_17(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[21],
    		{ type: "range" },
    		{ readOnly: /*readonly*/ ctx[15] },
    		{ class: /*classes*/ ctx[18] },
    		{ name: /*name*/ ctx[13] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[14] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$a, 375, 4, 7246);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[6]);
    			/*input_binding_13*/ ctx[198](input);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_14*/ ctx[116], false, false, false),
    					listen_dev(input, "change", /*change_handler_14*/ ctx[117], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_14*/ ctx[118], false, false, false),
    					listen_dev(input, "input", /*input_handler_14*/ ctx[119], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_14*/ ctx[120], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_14*/ ctx[121], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_14*/ ctx[122], false, false, false),
    					listen_dev(input, "change", /*input_change_input_handler*/ ctx[197]),
    					listen_dev(input, "input", /*input_change_input_handler*/ ctx[197])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 2097152 && /*$$restProps*/ ctx[21],
    				{ type: "range" },
    				dirty[0] & /*readonly*/ 32768 && { readOnly: /*readonly*/ ctx[15] },
    				dirty[0] & /*classes*/ 262144 && { class: /*classes*/ ctx[18] },
    				dirty[0] & /*name*/ 8192 && { name: /*name*/ ctx[13] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 16384 && { placeholder: /*placeholder*/ ctx[14] }
    			]));

    			if (dirty[0] & /*value*/ 64) {
    				set_input_value(input, /*value*/ ctx[6]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			/*input_binding_13*/ ctx[198](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_17.name,
    		type: "if",
    		source: "(375:29) ",
    		ctx
    	});

    	return block;
    }

    // (356:29) 
    function create_if_block_16(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[21],
    		{ type: "color" },
    		{ readOnly: /*readonly*/ ctx[15] },
    		{ class: /*classes*/ ctx[18] },
    		{ name: /*name*/ ctx[13] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[14] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$a, 356, 4, 6916);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[6]);
    			/*input_binding_12*/ ctx[196](input);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_13*/ ctx[109], false, false, false),
    					listen_dev(input, "change", /*change_handler_13*/ ctx[110], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_13*/ ctx[111], false, false, false),
    					listen_dev(input, "input", /*input_handler_13*/ ctx[112], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_13*/ ctx[113], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_13*/ ctx[114], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_13*/ ctx[115], false, false, false),
    					listen_dev(input, "input", /*input_input_handler_11*/ ctx[195])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 2097152 && /*$$restProps*/ ctx[21],
    				{ type: "color" },
    				dirty[0] & /*readonly*/ 32768 && { readOnly: /*readonly*/ ctx[15] },
    				dirty[0] & /*classes*/ 262144 && { class: /*classes*/ ctx[18] },
    				dirty[0] & /*name*/ 8192 && { name: /*name*/ ctx[13] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 16384 && { placeholder: /*placeholder*/ ctx[14] }
    			]));

    			if (dirty[0] & /*value*/ 64) {
    				set_input_value(input, /*value*/ ctx[6]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			/*input_binding_12*/ ctx[196](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_16.name,
    		type: "if",
    		source: "(356:29) ",
    		ctx
    	});

    	return block;
    }

    // (337:29) 
    function create_if_block_15(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[21],
    		{ class: /*classes*/ ctx[18] },
    		{ type: "month" },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ name: /*name*/ ctx[13] },
    		{ placeholder: /*placeholder*/ ctx[14] },
    		{ readOnly: /*readonly*/ ctx[15] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$a, 337, 4, 6586);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[6]);
    			/*input_binding_11*/ ctx[194](input);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_12*/ ctx[102], false, false, false),
    					listen_dev(input, "change", /*change_handler_12*/ ctx[103], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_12*/ ctx[104], false, false, false),
    					listen_dev(input, "input", /*input_handler_12*/ ctx[105], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_12*/ ctx[106], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_12*/ ctx[107], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_12*/ ctx[108], false, false, false),
    					listen_dev(input, "input", /*input_input_handler_10*/ ctx[193])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 2097152 && /*$$restProps*/ ctx[21],
    				dirty[0] & /*classes*/ 262144 && { class: /*classes*/ ctx[18] },
    				{ type: "month" },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*name*/ 8192 && { name: /*name*/ ctx[13] },
    				dirty[0] & /*placeholder*/ 16384 && { placeholder: /*placeholder*/ ctx[14] },
    				dirty[0] & /*readonly*/ 32768 && { readOnly: /*readonly*/ ctx[15] }
    			]));

    			if (dirty[0] & /*value*/ 64) {
    				set_input_value(input, /*value*/ ctx[6]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			/*input_binding_11*/ ctx[194](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_15.name,
    		type: "if",
    		source: "(337:29) ",
    		ctx
    	});

    	return block;
    }

    // (318:38) 
    function create_if_block_14(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[21],
    		{ class: /*classes*/ ctx[18] },
    		{ type: "datetime-local" },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ name: /*name*/ ctx[13] },
    		{ placeholder: /*placeholder*/ ctx[14] },
    		{ readOnly: /*readonly*/ ctx[15] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$a, 318, 4, 6247);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[6]);
    			/*input_binding_10*/ ctx[192](input);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_11*/ ctx[95], false, false, false),
    					listen_dev(input, "change", /*change_handler_11*/ ctx[96], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_11*/ ctx[97], false, false, false),
    					listen_dev(input, "input", /*input_handler_11*/ ctx[98], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_11*/ ctx[99], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_11*/ ctx[100], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_11*/ ctx[101], false, false, false),
    					listen_dev(input, "input", /*input_input_handler_9*/ ctx[191])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 2097152 && /*$$restProps*/ ctx[21],
    				dirty[0] & /*classes*/ 262144 && { class: /*classes*/ ctx[18] },
    				{ type: "datetime-local" },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*name*/ 8192 && { name: /*name*/ ctx[13] },
    				dirty[0] & /*placeholder*/ 16384 && { placeholder: /*placeholder*/ ctx[14] },
    				dirty[0] & /*readonly*/ 32768 && { readOnly: /*readonly*/ ctx[15] }
    			]));

    			if (dirty[0] & /*value*/ 64) {
    				set_input_value(input, /*value*/ ctx[6]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			/*input_binding_10*/ ctx[192](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_14.name,
    		type: "if",
    		source: "(318:38) ",
    		ctx
    	});

    	return block;
    }

    // (299:32) 
    function create_if_block_13(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[21],
    		{ type: "datetime" },
    		{ readOnly: /*readonly*/ ctx[15] },
    		{ class: /*classes*/ ctx[18] },
    		{ name: /*name*/ ctx[13] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[14] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$a, 299, 4, 5905);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[6]);
    			/*input_binding_9*/ ctx[190](input);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_10*/ ctx[88], false, false, false),
    					listen_dev(input, "change", /*change_handler_10*/ ctx[89], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_10*/ ctx[90], false, false, false),
    					listen_dev(input, "input", /*input_handler_10*/ ctx[91], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_10*/ ctx[92], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_10*/ ctx[93], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_10*/ ctx[94], false, false, false),
    					listen_dev(input, "input", /*input_input_handler_8*/ ctx[189])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 2097152 && /*$$restProps*/ ctx[21],
    				{ type: "datetime" },
    				dirty[0] & /*readonly*/ 32768 && { readOnly: /*readonly*/ ctx[15] },
    				dirty[0] & /*classes*/ 262144 && { class: /*classes*/ ctx[18] },
    				dirty[0] & /*name*/ 8192 && { name: /*name*/ ctx[13] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 16384 && { placeholder: /*placeholder*/ ctx[14] }
    			]));

    			if (dirty[0] & /*value*/ 64) {
    				set_input_value(input, /*value*/ ctx[6]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			/*input_binding_9*/ ctx[190](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_13.name,
    		type: "if",
    		source: "(299:32) ",
    		ctx
    	});

    	return block;
    }

    // (280:28) 
    function create_if_block_12(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[21],
    		{ class: /*classes*/ ctx[18] },
    		{ type: "time" },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ name: /*name*/ ctx[13] },
    		{ placeholder: /*placeholder*/ ctx[14] },
    		{ readOnly: /*readonly*/ ctx[15] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$a, 280, 4, 5573);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[6]);
    			/*input_binding_8*/ ctx[188](input);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_9*/ ctx[81], false, false, false),
    					listen_dev(input, "change", /*change_handler_9*/ ctx[82], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_9*/ ctx[83], false, false, false),
    					listen_dev(input, "input", /*input_handler_9*/ ctx[84], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_9*/ ctx[85], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_9*/ ctx[86], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_9*/ ctx[87], false, false, false),
    					listen_dev(input, "input", /*input_input_handler_7*/ ctx[187])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 2097152 && /*$$restProps*/ ctx[21],
    				dirty[0] & /*classes*/ 262144 && { class: /*classes*/ ctx[18] },
    				{ type: "time" },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*name*/ 8192 && { name: /*name*/ ctx[13] },
    				dirty[0] & /*placeholder*/ 16384 && { placeholder: /*placeholder*/ ctx[14] },
    				dirty[0] & /*readonly*/ 32768 && { readOnly: /*readonly*/ ctx[15] }
    			]));

    			if (dirty[0] & /*value*/ 64) {
    				set_input_value(input, /*value*/ ctx[6]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			/*input_binding_8*/ ctx[188](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_12.name,
    		type: "if",
    		source: "(280:28) ",
    		ctx
    	});

    	return block;
    }

    // (261:28) 
    function create_if_block_11(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[21],
    		{ class: /*classes*/ ctx[18] },
    		{ type: "date" },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ name: /*name*/ ctx[13] },
    		{ placeholder: /*placeholder*/ ctx[14] },
    		{ readOnly: /*readonly*/ ctx[15] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$a, 261, 4, 5245);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[6]);
    			/*input_binding_7*/ ctx[186](input);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_8*/ ctx[74], false, false, false),
    					listen_dev(input, "change", /*change_handler_8*/ ctx[75], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_8*/ ctx[76], false, false, false),
    					listen_dev(input, "input", /*input_handler_8*/ ctx[77], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_8*/ ctx[78], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_8*/ ctx[79], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_8*/ ctx[80], false, false, false),
    					listen_dev(input, "input", /*input_input_handler_6*/ ctx[185])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 2097152 && /*$$restProps*/ ctx[21],
    				dirty[0] & /*classes*/ 262144 && { class: /*classes*/ ctx[18] },
    				{ type: "date" },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*name*/ 8192 && { name: /*name*/ ctx[13] },
    				dirty[0] & /*placeholder*/ 16384 && { placeholder: /*placeholder*/ ctx[14] },
    				dirty[0] & /*readonly*/ 32768 && { readOnly: /*readonly*/ ctx[15] }
    			]));

    			if (dirty[0] & /*value*/ 64) {
    				set_input_value(input, /*value*/ ctx[6]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			/*input_binding_7*/ ctx[186](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11.name,
    		type: "if",
    		source: "(261:28) ",
    		ctx
    	});

    	return block;
    }

    // (242:30) 
    function create_if_block_10(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[21],
    		{ class: /*classes*/ ctx[18] },
    		{ type: "number" },
    		{ readOnly: /*readonly*/ ctx[15] },
    		{ name: /*name*/ ctx[13] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[14] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$a, 242, 4, 4915);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[6]);
    			/*input_binding_6*/ ctx[184](input);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_7*/ ctx[67], false, false, false),
    					listen_dev(input, "change", /*change_handler_7*/ ctx[68], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_7*/ ctx[69], false, false, false),
    					listen_dev(input, "input", /*input_handler_7*/ ctx[70], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_7*/ ctx[71], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_7*/ ctx[72], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_7*/ ctx[73], false, false, false),
    					listen_dev(input, "input", /*input_input_handler_5*/ ctx[183])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 2097152 && /*$$restProps*/ ctx[21],
    				dirty[0] & /*classes*/ 262144 && { class: /*classes*/ ctx[18] },
    				{ type: "number" },
    				dirty[0] & /*readonly*/ 32768 && { readOnly: /*readonly*/ ctx[15] },
    				dirty[0] & /*name*/ 8192 && { name: /*name*/ ctx[13] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 16384 && { placeholder: /*placeholder*/ ctx[14] }
    			]));

    			if (dirty[0] & /*value*/ 64 && to_number(input.value) !== /*value*/ ctx[6]) {
    				set_input_value(input, /*value*/ ctx[6]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			/*input_binding_6*/ ctx[184](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(242:30) ",
    		ctx
    	});

    	return block;
    }

    // (222:27) 
    function create_if_block_9(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[21],
    		{ class: /*classes*/ ctx[18] },
    		{ type: "url" },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ name: /*name*/ ctx[13] },
    		{ placeholder: /*placeholder*/ ctx[14] },
    		{ readOnly: /*readonly*/ ctx[15] },
    		{ size: /*size*/ ctx[1] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$a, 222, 4, 4573);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[6]);
    			/*input_binding_5*/ ctx[182](input);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_6*/ ctx[60], false, false, false),
    					listen_dev(input, "change", /*change_handler_6*/ ctx[61], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_6*/ ctx[62], false, false, false),
    					listen_dev(input, "input", /*input_handler_6*/ ctx[63], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_6*/ ctx[64], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_6*/ ctx[65], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_6*/ ctx[66], false, false, false),
    					listen_dev(input, "input", /*input_input_handler_4*/ ctx[181])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 2097152 && /*$$restProps*/ ctx[21],
    				dirty[0] & /*classes*/ 262144 && { class: /*classes*/ ctx[18] },
    				{ type: "url" },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*name*/ 8192 && { name: /*name*/ ctx[13] },
    				dirty[0] & /*placeholder*/ 16384 && { placeholder: /*placeholder*/ ctx[14] },
    				dirty[0] & /*readonly*/ 32768 && { readOnly: /*readonly*/ ctx[15] },
    				dirty[0] & /*size*/ 2 && { size: /*size*/ ctx[1] }
    			]));

    			if (dirty[0] & /*value*/ 64) {
    				set_input_value(input, /*value*/ ctx[6]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			/*input_binding_5*/ ctx[182](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(222:27) ",
    		ctx
    	});

    	return block;
    }

    // (197:73) 
    function create_if_block_8(ctx) {
    	let formcheck;
    	let updating_checked;
    	let updating_inner;
    	let updating_group;
    	let updating_value;
    	let current;

    	const formcheck_spread_levels = [
    		/*$$restProps*/ ctx[21],
    		{ class: /*className*/ ctx[7] },
    		{ size: /*bsSize*/ ctx[0] },
    		{ type: /*type*/ ctx[16] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ invalid: /*invalid*/ ctx[10] },
    		{ label: /*label*/ ctx[11] },
    		{ name: /*name*/ ctx[13] },
    		{ placeholder: /*placeholder*/ ctx[14] },
    		{ readonly: /*readonly*/ ctx[15] },
    		{ valid: /*valid*/ ctx[17] }
    	];

    	function formcheck_checked_binding(value) {
    		/*formcheck_checked_binding*/ ctx[170](value);
    	}

    	function formcheck_inner_binding(value) {
    		/*formcheck_inner_binding*/ ctx[171](value);
    	}

    	function formcheck_group_binding(value) {
    		/*formcheck_group_binding*/ ctx[172](value);
    	}

    	function formcheck_value_binding(value) {
    		/*formcheck_value_binding*/ ctx[173](value);
    	}

    	let formcheck_props = {};

    	for (let i = 0; i < formcheck_spread_levels.length; i += 1) {
    		formcheck_props = assign(formcheck_props, formcheck_spread_levels[i]);
    	}

    	if (/*checked*/ ctx[2] !== void 0) {
    		formcheck_props.checked = /*checked*/ ctx[2];
    	}

    	if (/*inner*/ ctx[5] !== void 0) {
    		formcheck_props.inner = /*inner*/ ctx[5];
    	}

    	if (/*group*/ ctx[4] !== void 0) {
    		formcheck_props.group = /*group*/ ctx[4];
    	}

    	if (/*value*/ ctx[6] !== void 0) {
    		formcheck_props.value = /*value*/ ctx[6];
    	}

    	formcheck = new FormCheck({ props: formcheck_props, $$inline: true });
    	binding_callbacks.push(() => bind(formcheck, 'checked', formcheck_checked_binding));
    	binding_callbacks.push(() => bind(formcheck, 'inner', formcheck_inner_binding));
    	binding_callbacks.push(() => bind(formcheck, 'group', formcheck_group_binding));
    	binding_callbacks.push(() => bind(formcheck, 'value', formcheck_value_binding));
    	formcheck.$on("blur", /*blur_handler_5*/ ctx[174]);
    	formcheck.$on("change", /*change_handler_5*/ ctx[175]);
    	formcheck.$on("focus", /*focus_handler_5*/ ctx[176]);
    	formcheck.$on("input", /*input_handler_5*/ ctx[177]);
    	formcheck.$on("keydown", /*keydown_handler_5*/ ctx[178]);
    	formcheck.$on("keypress", /*keypress_handler_5*/ ctx[179]);
    	formcheck.$on("keyup", /*keyup_handler_5*/ ctx[180]);

    	const block = {
    		c: function create() {
    			create_component(formcheck.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(formcheck, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const formcheck_changes = (dirty[0] & /*$$restProps, className, bsSize, type, disabled, invalid, label, name, placeholder, readonly, valid*/ 2354561)
    			? get_spread_update(formcheck_spread_levels, [
    					dirty[0] & /*$$restProps*/ 2097152 && get_spread_object(/*$$restProps*/ ctx[21]),
    					dirty[0] & /*className*/ 128 && { class: /*className*/ ctx[7] },
    					dirty[0] & /*bsSize*/ 1 && { size: /*bsSize*/ ctx[0] },
    					dirty[0] & /*type*/ 65536 && { type: /*type*/ ctx[16] },
    					dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    					dirty[0] & /*invalid*/ 1024 && { invalid: /*invalid*/ ctx[10] },
    					dirty[0] & /*label*/ 2048 && { label: /*label*/ ctx[11] },
    					dirty[0] & /*name*/ 8192 && { name: /*name*/ ctx[13] },
    					dirty[0] & /*placeholder*/ 16384 && { placeholder: /*placeholder*/ ctx[14] },
    					dirty[0] & /*readonly*/ 32768 && { readonly: /*readonly*/ ctx[15] },
    					dirty[0] & /*valid*/ 131072 && { valid: /*valid*/ ctx[17] }
    				])
    			: {};

    			if (!updating_checked && dirty[0] & /*checked*/ 4) {
    				updating_checked = true;
    				formcheck_changes.checked = /*checked*/ ctx[2];
    				add_flush_callback(() => updating_checked = false);
    			}

    			if (!updating_inner && dirty[0] & /*inner*/ 32) {
    				updating_inner = true;
    				formcheck_changes.inner = /*inner*/ ctx[5];
    				add_flush_callback(() => updating_inner = false);
    			}

    			if (!updating_group && dirty[0] & /*group*/ 16) {
    				updating_group = true;
    				formcheck_changes.group = /*group*/ ctx[4];
    				add_flush_callback(() => updating_group = false);
    			}

    			if (!updating_value && dirty[0] & /*value*/ 64) {
    				updating_value = true;
    				formcheck_changes.value = /*value*/ ctx[6];
    				add_flush_callback(() => updating_value = false);
    			}

    			formcheck.$set(formcheck_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(formcheck.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(formcheck.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(formcheck, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(197:73) ",
    		ctx
    	});

    	return block;
    }

    // (174:28) 
    function create_if_block_7(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[21],
    		{ class: /*classes*/ ctx[18] },
    		{ type: "file" },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ invalid: /*invalid*/ ctx[10] },
    		{ multiple: /*multiple*/ ctx[12] },
    		{ name: /*name*/ ctx[13] },
    		{ placeholder: /*placeholder*/ ctx[14] },
    		{ readOnly: /*readonly*/ ctx[15] },
    		{ valid: /*valid*/ ctx[17] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$a, 174, 4, 3715);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			/*input_binding_4*/ ctx[169](input);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_4*/ ctx[53], false, false, false),
    					listen_dev(input, "change", /*change_handler_4*/ ctx[54], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_4*/ ctx[55], false, false, false),
    					listen_dev(input, "input", /*input_handler_4*/ ctx[56], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_4*/ ctx[57], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_4*/ ctx[58], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_4*/ ctx[59], false, false, false),
    					listen_dev(input, "change", /*input_change_handler*/ ctx[168])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 2097152 && /*$$restProps*/ ctx[21],
    				dirty[0] & /*classes*/ 262144 && { class: /*classes*/ ctx[18] },
    				{ type: "file" },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*invalid*/ 1024 && { invalid: /*invalid*/ ctx[10] },
    				dirty[0] & /*multiple*/ 4096 && { multiple: /*multiple*/ ctx[12] },
    				dirty[0] & /*name*/ 8192 && { name: /*name*/ ctx[13] },
    				dirty[0] & /*placeholder*/ 16384 && { placeholder: /*placeholder*/ ctx[14] },
    				dirty[0] & /*readonly*/ 32768 && { readOnly: /*readonly*/ ctx[15] },
    				dirty[0] & /*valid*/ 131072 && { valid: /*valid*/ ctx[17] }
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			/*input_binding_4*/ ctx[169](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(174:28) ",
    		ctx
    	});

    	return block;
    }

    // (153:29) 
    function create_if_block_6(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[21],
    		{ class: /*classes*/ ctx[18] },
    		{ type: "email" },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ multiple: /*multiple*/ ctx[12] },
    		{ name: /*name*/ ctx[13] },
    		{ placeholder: /*placeholder*/ ctx[14] },
    		{ readOnly: /*readonly*/ ctx[15] },
    		{ size: /*size*/ ctx[1] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$a, 153, 4, 3356);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[6]);
    			/*input_binding_3*/ ctx[167](input);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_3*/ ctx[46], false, false, false),
    					listen_dev(input, "change", /*change_handler_3*/ ctx[47], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_3*/ ctx[48], false, false, false),
    					listen_dev(input, "input", /*input_handler_3*/ ctx[49], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_3*/ ctx[50], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_3*/ ctx[51], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_3*/ ctx[52], false, false, false),
    					listen_dev(input, "input", /*input_input_handler_3*/ ctx[166])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 2097152 && /*$$restProps*/ ctx[21],
    				dirty[0] & /*classes*/ 262144 && { class: /*classes*/ ctx[18] },
    				{ type: "email" },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*multiple*/ 4096 && { multiple: /*multiple*/ ctx[12] },
    				dirty[0] & /*name*/ 8192 && { name: /*name*/ ctx[13] },
    				dirty[0] & /*placeholder*/ 16384 && { placeholder: /*placeholder*/ ctx[14] },
    				dirty[0] & /*readonly*/ 32768 && { readOnly: /*readonly*/ ctx[15] },
    				dirty[0] & /*size*/ 2 && { size: /*size*/ ctx[1] }
    			]));

    			if (dirty[0] & /*value*/ 64 && input.value !== /*value*/ ctx[6]) {
    				set_input_value(input, /*value*/ ctx[6]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			/*input_binding_3*/ ctx[167](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(153:29) ",
    		ctx
    	});

    	return block;
    }

    // (134:29) 
    function create_if_block_5(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[21],
    		{ class: /*classes*/ ctx[18] },
    		{ type: "color" },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ name: /*name*/ ctx[13] },
    		{ placeholder: /*placeholder*/ ctx[14] },
    		{ readOnly: /*readonly*/ ctx[15] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$a, 134, 4, 3026);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[6]);
    			/*input_binding_2*/ ctx[165](input);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_2*/ ctx[39], false, false, false),
    					listen_dev(input, "change", /*change_handler_2*/ ctx[40], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_2*/ ctx[41], false, false, false),
    					listen_dev(input, "input", /*input_handler_2*/ ctx[42], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_2*/ ctx[43], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_2*/ ctx[44], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_2*/ ctx[45], false, false, false),
    					listen_dev(input, "input", /*input_input_handler_2*/ ctx[164])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 2097152 && /*$$restProps*/ ctx[21],
    				dirty[0] & /*classes*/ 262144 && { class: /*classes*/ ctx[18] },
    				{ type: "color" },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*name*/ 8192 && { name: /*name*/ ctx[13] },
    				dirty[0] & /*placeholder*/ 16384 && { placeholder: /*placeholder*/ ctx[14] },
    				dirty[0] & /*readonly*/ 32768 && { readOnly: /*readonly*/ ctx[15] }
    			]));

    			if (dirty[0] & /*value*/ 64) {
    				set_input_value(input, /*value*/ ctx[6]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			/*input_binding_2*/ ctx[165](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(134:29) ",
    		ctx
    	});

    	return block;
    }

    // (114:32) 
    function create_if_block_4(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[21],
    		{ class: /*classes*/ ctx[18] },
    		{ type: "password" },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ name: /*name*/ ctx[13] },
    		{ placeholder: /*placeholder*/ ctx[14] },
    		{ readOnly: /*readonly*/ ctx[15] },
    		{ size: /*size*/ ctx[1] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$a, 114, 4, 2680);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[6]);
    			/*input_binding_1*/ ctx[163](input);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_1*/ ctx[32], false, false, false),
    					listen_dev(input, "change", /*change_handler_1*/ ctx[33], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_1*/ ctx[34], false, false, false),
    					listen_dev(input, "input", /*input_handler_1*/ ctx[35], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_1*/ ctx[36], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_1*/ ctx[37], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_1*/ ctx[38], false, false, false),
    					listen_dev(input, "input", /*input_input_handler_1*/ ctx[162])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 2097152 && /*$$restProps*/ ctx[21],
    				dirty[0] & /*classes*/ 262144 && { class: /*classes*/ ctx[18] },
    				{ type: "password" },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*name*/ 8192 && { name: /*name*/ ctx[13] },
    				dirty[0] & /*placeholder*/ 16384 && { placeholder: /*placeholder*/ ctx[14] },
    				dirty[0] & /*readonly*/ 32768 && { readOnly: /*readonly*/ ctx[15] },
    				dirty[0] & /*size*/ 2 && { size: /*size*/ ctx[1] }
    			]));

    			if (dirty[0] & /*value*/ 64 && input.value !== /*value*/ ctx[6]) {
    				set_input_value(input, /*value*/ ctx[6]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			/*input_binding_1*/ ctx[163](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(114:32) ",
    		ctx
    	});

    	return block;
    }

    // (94:2) {#if type === 'text'}
    function create_if_block_3(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[21],
    		{ class: /*classes*/ ctx[18] },
    		{ type: "text" },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ name: /*name*/ ctx[13] },
    		{ placeholder: /*placeholder*/ ctx[14] },
    		{ readOnly: /*readonly*/ ctx[15] },
    		{ size: /*size*/ ctx[1] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$a, 94, 4, 2335);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[6]);
    			/*input_binding*/ ctx[161](input);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler*/ ctx[25], false, false, false),
    					listen_dev(input, "change", /*change_handler*/ ctx[26], false, false, false),
    					listen_dev(input, "focus", /*focus_handler*/ ctx[27], false, false, false),
    					listen_dev(input, "input", /*input_handler*/ ctx[28], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler*/ ctx[29], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler*/ ctx[30], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler*/ ctx[31], false, false, false),
    					listen_dev(input, "input", /*input_input_handler*/ ctx[160])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 2097152 && /*$$restProps*/ ctx[21],
    				dirty[0] & /*classes*/ 262144 && { class: /*classes*/ ctx[18] },
    				{ type: "text" },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*name*/ 8192 && { name: /*name*/ ctx[13] },
    				dirty[0] & /*placeholder*/ 16384 && { placeholder: /*placeholder*/ ctx[14] },
    				dirty[0] & /*readonly*/ 32768 && { readOnly: /*readonly*/ ctx[15] },
    				dirty[0] & /*size*/ 2 && { size: /*size*/ ctx[1] }
    			]));

    			if (dirty[0] & /*value*/ 64 && input.value !== /*value*/ ctx[6]) {
    				set_input_value(input, /*value*/ ctx[6]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			/*input_binding*/ ctx[161](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(94:2) {#if type === 'text'}",
    		ctx
    	});

    	return block;
    }

    // (523:0) {#if feedback}
    function create_if_block$1(ctx) {
    	let show_if;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type_2(ctx, dirty) {
    		if (dirty[0] & /*feedback*/ 512) show_if = null;
    		if (show_if == null) show_if = !!Array.isArray(/*feedback*/ ctx[9]);
    		if (show_if) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_2(ctx, [-1, -1, -1, -1, -1, -1, -1]);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_2(ctx, dirty);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(523:0) {#if feedback}",
    		ctx
    	});

    	return block;
    }

    // (528:2) {:else}
    function create_else_block$1(ctx) {
    	let formfeedback;
    	let current;

    	formfeedback = new FormFeedback({
    			props: {
    				valid: /*valid*/ ctx[17],
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(formfeedback.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(formfeedback, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const formfeedback_changes = {};
    			if (dirty[0] & /*valid*/ 131072) formfeedback_changes.valid = /*valid*/ ctx[17];

    			if (dirty[0] & /*feedback*/ 512 | dirty[6] & /*$$scope*/ 8388608) {
    				formfeedback_changes.$$scope = { dirty, ctx };
    			}

    			formfeedback.$set(formfeedback_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(formfeedback.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(formfeedback.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(formfeedback, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(528:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (524:2) {#if Array.isArray(feedback)}
    function create_if_block_1(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*feedback*/ ctx[9];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*valid, feedback*/ 131584) {
    				each_value = /*feedback*/ ctx[9];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(524:2) {#if Array.isArray(feedback)}",
    		ctx
    	});

    	return block;
    }

    // (529:4) <FormFeedback {valid}>
    function create_default_slot_1$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*feedback*/ ctx[9]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*feedback*/ 512) set_data_dev(t, /*feedback*/ ctx[9]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(529:4) <FormFeedback {valid}>",
    		ctx
    	});

    	return block;
    }

    // (526:6) <FormFeedback {valid}>
    function create_default_slot$4(ctx) {
    	let t_value = /*msg*/ ctx[210] + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*feedback*/ 512 && t_value !== (t_value = /*msg*/ ctx[210] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(526:6) <FormFeedback {valid}>",
    		ctx
    	});

    	return block;
    }

    // (525:4) {#each feedback as msg}
    function create_each_block(ctx) {
    	let formfeedback;
    	let current;

    	formfeedback = new FormFeedback({
    			props: {
    				valid: /*valid*/ ctx[17],
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(formfeedback.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(formfeedback, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const formfeedback_changes = {};
    			if (dirty[0] & /*valid*/ 131072) formfeedback_changes.valid = /*valid*/ ctx[17];

    			if (dirty[0] & /*feedback*/ 512 | dirty[6] & /*$$scope*/ 8388608) {
    				formfeedback_changes.$$scope = { dirty, ctx };
    			}

    			formfeedback.$set(formfeedback_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(formfeedback.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(formfeedback.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(formfeedback, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(525:4) {#each feedback as msg}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let current_block_type_index;
    	let if_block0;
    	let t;
    	let if_block1_anchor;
    	let current;
    	const if_block_creators = [create_if_block_2, create_if_block_21, create_if_block_22];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*tag*/ ctx[19] === 'input') return 0;
    		if (/*tag*/ ctx[19] === 'textarea') return 1;
    		if (/*tag*/ ctx[19] === 'select' && !/*multiple*/ ctx[12]) return 2;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	let if_block1 = /*feedback*/ ctx[9] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, t, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block0) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block0 = if_blocks[current_block_type_index];

    					if (!if_block0) {
    						if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block0.c();
    					} else {
    						if_block0.p(ctx, dirty);
    					}

    					transition_in(if_block0, 1);
    					if_block0.m(t.parentNode, t);
    				} else {
    					if_block0 = null;
    				}
    			}

    			if (/*feedback*/ ctx[9]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*feedback*/ 512) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(t);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"class","bsSize","checked","color","disabled","feedback","files","group","inner","invalid","label","multiple","name","placeholder","plaintext","readonly","size","type","valid","value"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Input', slots, ['default']);
    	let { class: className = '' } = $$props;
    	let { bsSize = undefined } = $$props;
    	let { checked = false } = $$props;
    	let { color = undefined } = $$props;
    	let { disabled = undefined } = $$props;
    	let { feedback = undefined } = $$props;
    	let { files = undefined } = $$props;
    	let { group = undefined } = $$props;
    	let { inner = undefined } = $$props;
    	let { invalid = false } = $$props;
    	let { label = undefined } = $$props;
    	let { multiple = undefined } = $$props;
    	let { name = '' } = $$props;
    	let { placeholder = '' } = $$props;
    	let { plaintext = false } = $$props;
    	let { readonly = undefined } = $$props;
    	let { size = undefined } = $$props;
    	let { type = 'text' } = $$props;
    	let { valid = false } = $$props;
    	let { value = '' } = $$props;
    	let classes;
    	let tag;

    	const handleInput = event => {
    		$$invalidate(6, value = event.target.value);
    	};

    	function blur_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_3(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_3(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_3(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_3(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_3(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_3(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_3(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_4(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_4(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_4(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_4(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_4(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_4(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_4(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_6(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_6(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_6(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_6(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_6(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_6(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_6(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_7(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_7(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_7(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_7(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_7(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_7(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_7(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_8(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_8(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_8(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_8(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_8(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_8(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_8(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_9(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_9(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_9(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_9(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_9(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_9(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_9(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_10(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_10(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_10(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_10(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_10(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_10(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_10(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_11(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_11(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_11(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_11(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_11(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_11(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_11(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_12(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_12(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_12(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_12(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_12(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_12(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_12(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_13(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_13(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_13(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_13(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_13(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_13(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_13(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_14(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_14(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_14(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_14(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_14(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_14(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_14(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_15(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_15(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_15(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_15(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_15(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_15(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_15(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_16(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_16(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_16(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_16(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_16(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_16(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_16(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_17(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_17(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_17(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_17(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_17(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_17(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_17(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_18(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_18(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_18(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_18(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_18(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_19(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_18(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_19(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_18(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_19(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_19(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_19(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_20(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_19(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_20(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_19(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_input_handler() {
    		value = this.value;
    		$$invalidate(6, value);
    	}

    	function input_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(5, inner);
    		});
    	}

    	function input_input_handler_1() {
    		value = this.value;
    		$$invalidate(6, value);
    	}

    	function input_binding_1($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(5, inner);
    		});
    	}

    	function input_input_handler_2() {
    		value = this.value;
    		$$invalidate(6, value);
    	}

    	function input_binding_2($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(5, inner);
    		});
    	}

    	function input_input_handler_3() {
    		value = this.value;
    		$$invalidate(6, value);
    	}

    	function input_binding_3($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(5, inner);
    		});
    	}

    	function input_change_handler() {
    		files = this.files;
    		value = this.value;
    		$$invalidate(3, files);
    		$$invalidate(6, value);
    	}

    	function input_binding_4($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(5, inner);
    		});
    	}

    	function formcheck_checked_binding(value) {
    		checked = value;
    		$$invalidate(2, checked);
    	}

    	function formcheck_inner_binding(value) {
    		inner = value;
    		$$invalidate(5, inner);
    	}

    	function formcheck_group_binding(value) {
    		group = value;
    		$$invalidate(4, group);
    	}

    	function formcheck_value_binding(value$1) {
    		value = value$1;
    		$$invalidate(6, value);
    	}

    	function blur_handler_5(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_5(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_5(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_5(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_5(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_5(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_5(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_input_handler_4() {
    		value = this.value;
    		$$invalidate(6, value);
    	}

    	function input_binding_5($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(5, inner);
    		});
    	}

    	function input_input_handler_5() {
    		value = to_number(this.value);
    		$$invalidate(6, value);
    	}

    	function input_binding_6($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(5, inner);
    		});
    	}

    	function input_input_handler_6() {
    		value = this.value;
    		$$invalidate(6, value);
    	}

    	function input_binding_7($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(5, inner);
    		});
    	}

    	function input_input_handler_7() {
    		value = this.value;
    		$$invalidate(6, value);
    	}

    	function input_binding_8($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(5, inner);
    		});
    	}

    	function input_input_handler_8() {
    		value = this.value;
    		$$invalidate(6, value);
    	}

    	function input_binding_9($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(5, inner);
    		});
    	}

    	function input_input_handler_9() {
    		value = this.value;
    		$$invalidate(6, value);
    	}

    	function input_binding_10($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(5, inner);
    		});
    	}

    	function input_input_handler_10() {
    		value = this.value;
    		$$invalidate(6, value);
    	}

    	function input_binding_11($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(5, inner);
    		});
    	}

    	function input_input_handler_11() {
    		value = this.value;
    		$$invalidate(6, value);
    	}

    	function input_binding_12($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(5, inner);
    		});
    	}

    	function input_change_input_handler() {
    		value = to_number(this.value);
    		$$invalidate(6, value);
    	}

    	function input_binding_13($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(5, inner);
    		});
    	}

    	function input_input_handler_12() {
    		value = this.value;
    		$$invalidate(6, value);
    	}

    	function input_binding_14($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(5, inner);
    		});
    	}

    	function input_input_handler_13() {
    		value = this.value;
    		$$invalidate(6, value);
    	}

    	function input_binding_15($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(5, inner);
    		});
    	}

    	function input_input_handler_14() {
    		value = this.value;
    		$$invalidate(6, value);
    	}

    	function input_binding_16($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(5, inner);
    		});
    	}

    	function textarea_input_handler() {
    		value = this.value;
    		$$invalidate(6, value);
    	}

    	function textarea_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(5, inner);
    		});
    	}

    	function select_change_handler() {
    		value = select_value(this);
    		$$invalidate(6, value);
    	}

    	function select_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(5, inner);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(21, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(7, className = $$new_props.class);
    		if ('bsSize' in $$new_props) $$invalidate(0, bsSize = $$new_props.bsSize);
    		if ('checked' in $$new_props) $$invalidate(2, checked = $$new_props.checked);
    		if ('color' in $$new_props) $$invalidate(22, color = $$new_props.color);
    		if ('disabled' in $$new_props) $$invalidate(8, disabled = $$new_props.disabled);
    		if ('feedback' in $$new_props) $$invalidate(9, feedback = $$new_props.feedback);
    		if ('files' in $$new_props) $$invalidate(3, files = $$new_props.files);
    		if ('group' in $$new_props) $$invalidate(4, group = $$new_props.group);
    		if ('inner' in $$new_props) $$invalidate(5, inner = $$new_props.inner);
    		if ('invalid' in $$new_props) $$invalidate(10, invalid = $$new_props.invalid);
    		if ('label' in $$new_props) $$invalidate(11, label = $$new_props.label);
    		if ('multiple' in $$new_props) $$invalidate(12, multiple = $$new_props.multiple);
    		if ('name' in $$new_props) $$invalidate(13, name = $$new_props.name);
    		if ('placeholder' in $$new_props) $$invalidate(14, placeholder = $$new_props.placeholder);
    		if ('plaintext' in $$new_props) $$invalidate(23, plaintext = $$new_props.plaintext);
    		if ('readonly' in $$new_props) $$invalidate(15, readonly = $$new_props.readonly);
    		if ('size' in $$new_props) $$invalidate(1, size = $$new_props.size);
    		if ('type' in $$new_props) $$invalidate(16, type = $$new_props.type);
    		if ('valid' in $$new_props) $$invalidate(17, valid = $$new_props.valid);
    		if ('value' in $$new_props) $$invalidate(6, value = $$new_props.value);
    		if ('$$scope' in $$new_props) $$invalidate(209, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		FormCheck,
    		FormFeedback,
    		classnames,
    		className,
    		bsSize,
    		checked,
    		color,
    		disabled,
    		feedback,
    		files,
    		group,
    		inner,
    		invalid,
    		label,
    		multiple,
    		name,
    		placeholder,
    		plaintext,
    		readonly,
    		size,
    		type,
    		valid,
    		value,
    		classes,
    		tag,
    		handleInput
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(7, className = $$new_props.className);
    		if ('bsSize' in $$props) $$invalidate(0, bsSize = $$new_props.bsSize);
    		if ('checked' in $$props) $$invalidate(2, checked = $$new_props.checked);
    		if ('color' in $$props) $$invalidate(22, color = $$new_props.color);
    		if ('disabled' in $$props) $$invalidate(8, disabled = $$new_props.disabled);
    		if ('feedback' in $$props) $$invalidate(9, feedback = $$new_props.feedback);
    		if ('files' in $$props) $$invalidate(3, files = $$new_props.files);
    		if ('group' in $$props) $$invalidate(4, group = $$new_props.group);
    		if ('inner' in $$props) $$invalidate(5, inner = $$new_props.inner);
    		if ('invalid' in $$props) $$invalidate(10, invalid = $$new_props.invalid);
    		if ('label' in $$props) $$invalidate(11, label = $$new_props.label);
    		if ('multiple' in $$props) $$invalidate(12, multiple = $$new_props.multiple);
    		if ('name' in $$props) $$invalidate(13, name = $$new_props.name);
    		if ('placeholder' in $$props) $$invalidate(14, placeholder = $$new_props.placeholder);
    		if ('plaintext' in $$props) $$invalidate(23, plaintext = $$new_props.plaintext);
    		if ('readonly' in $$props) $$invalidate(15, readonly = $$new_props.readonly);
    		if ('size' in $$props) $$invalidate(1, size = $$new_props.size);
    		if ('type' in $$props) $$invalidate(16, type = $$new_props.type);
    		if ('valid' in $$props) $$invalidate(17, valid = $$new_props.valid);
    		if ('value' in $$props) $$invalidate(6, value = $$new_props.value);
    		if ('classes' in $$props) $$invalidate(18, classes = $$new_props.classes);
    		if ('tag' in $$props) $$invalidate(19, tag = $$new_props.tag);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*type, color, plaintext, size, className, invalid, valid, bsSize*/ 12780675) {
    			{
    				const isNotaNumber = new RegExp('\\D', 'g');
    				let isBtn = false;
    				let formControlClass = 'form-control';
    				$$invalidate(19, tag = 'input');

    				switch (type) {
    					case 'color':
    						formControlClass = `form-control form-control-color`;
    						break;
    					case 'range':
    						formControlClass = 'form-range';
    						break;
    					case 'select':
    						formControlClass = `form-select`;
    						$$invalidate(19, tag = 'select');
    						break;
    					case 'textarea':
    						$$invalidate(19, tag = 'textarea');
    						break;
    					case 'button':
    					case 'reset':
    					case 'submit':
    						formControlClass = `btn btn-${color || 'secondary'}`;
    						isBtn = true;
    						break;
    					case 'hidden':
    					case 'image':
    						formControlClass = undefined;
    						break;
    					default:
    						formControlClass = 'form-control';
    						$$invalidate(19, tag = 'input');
    				}

    				if (plaintext) {
    					formControlClass = `${formControlClass}-plaintext`;
    					$$invalidate(19, tag = 'input');
    				}

    				if (size && isNotaNumber.test(size)) {
    					console.warn('Please use the prop "bsSize" instead of the "size" to bootstrap\'s input sizing.');
    					$$invalidate(0, bsSize = size);
    					$$invalidate(1, size = undefined);
    				}

    				$$invalidate(18, classes = classnames(className, formControlClass, {
    					'is-invalid': invalid,
    					'is-valid': valid,
    					[`form-control-${bsSize}`]: bsSize && !isBtn,
    					[`btn-${bsSize}`]: bsSize && isBtn
    				}));
    			}
    		}
    	};

    	return [
    		bsSize,
    		size,
    		checked,
    		files,
    		group,
    		inner,
    		value,
    		className,
    		disabled,
    		feedback,
    		invalid,
    		label,
    		multiple,
    		name,
    		placeholder,
    		readonly,
    		type,
    		valid,
    		classes,
    		tag,
    		handleInput,
    		$$restProps,
    		color,
    		plaintext,
    		slots,
    		blur_handler,
    		change_handler,
    		focus_handler,
    		input_handler,
    		keydown_handler,
    		keypress_handler,
    		keyup_handler,
    		blur_handler_1,
    		change_handler_1,
    		focus_handler_1,
    		input_handler_1,
    		keydown_handler_1,
    		keypress_handler_1,
    		keyup_handler_1,
    		blur_handler_2,
    		change_handler_2,
    		focus_handler_2,
    		input_handler_2,
    		keydown_handler_2,
    		keypress_handler_2,
    		keyup_handler_2,
    		blur_handler_3,
    		change_handler_3,
    		focus_handler_3,
    		input_handler_3,
    		keydown_handler_3,
    		keypress_handler_3,
    		keyup_handler_3,
    		blur_handler_4,
    		change_handler_4,
    		focus_handler_4,
    		input_handler_4,
    		keydown_handler_4,
    		keypress_handler_4,
    		keyup_handler_4,
    		blur_handler_6,
    		change_handler_6,
    		focus_handler_6,
    		input_handler_6,
    		keydown_handler_6,
    		keypress_handler_6,
    		keyup_handler_6,
    		blur_handler_7,
    		change_handler_7,
    		focus_handler_7,
    		input_handler_7,
    		keydown_handler_7,
    		keypress_handler_7,
    		keyup_handler_7,
    		blur_handler_8,
    		change_handler_8,
    		focus_handler_8,
    		input_handler_8,
    		keydown_handler_8,
    		keypress_handler_8,
    		keyup_handler_8,
    		blur_handler_9,
    		change_handler_9,
    		focus_handler_9,
    		input_handler_9,
    		keydown_handler_9,
    		keypress_handler_9,
    		keyup_handler_9,
    		blur_handler_10,
    		change_handler_10,
    		focus_handler_10,
    		input_handler_10,
    		keydown_handler_10,
    		keypress_handler_10,
    		keyup_handler_10,
    		blur_handler_11,
    		change_handler_11,
    		focus_handler_11,
    		input_handler_11,
    		keydown_handler_11,
    		keypress_handler_11,
    		keyup_handler_11,
    		blur_handler_12,
    		change_handler_12,
    		focus_handler_12,
    		input_handler_12,
    		keydown_handler_12,
    		keypress_handler_12,
    		keyup_handler_12,
    		blur_handler_13,
    		change_handler_13,
    		focus_handler_13,
    		input_handler_13,
    		keydown_handler_13,
    		keypress_handler_13,
    		keyup_handler_13,
    		blur_handler_14,
    		change_handler_14,
    		focus_handler_14,
    		input_handler_14,
    		keydown_handler_14,
    		keypress_handler_14,
    		keyup_handler_14,
    		blur_handler_15,
    		change_handler_15,
    		focus_handler_15,
    		input_handler_15,
    		keydown_handler_15,
    		keypress_handler_15,
    		keyup_handler_15,
    		blur_handler_16,
    		change_handler_16,
    		focus_handler_16,
    		input_handler_16,
    		keydown_handler_16,
    		keypress_handler_16,
    		keyup_handler_16,
    		blur_handler_17,
    		change_handler_17,
    		focus_handler_17,
    		input_handler_17,
    		keydown_handler_17,
    		keypress_handler_17,
    		keyup_handler_17,
    		blur_handler_18,
    		focus_handler_18,
    		keydown_handler_18,
    		keypress_handler_18,
    		keyup_handler_18,
    		blur_handler_19,
    		change_handler_18,
    		focus_handler_19,
    		input_handler_18,
    		keydown_handler_19,
    		keypress_handler_19,
    		keyup_handler_19,
    		blur_handler_20,
    		change_handler_19,
    		focus_handler_20,
    		input_handler_19,
    		input_input_handler,
    		input_binding,
    		input_input_handler_1,
    		input_binding_1,
    		input_input_handler_2,
    		input_binding_2,
    		input_input_handler_3,
    		input_binding_3,
    		input_change_handler,
    		input_binding_4,
    		formcheck_checked_binding,
    		formcheck_inner_binding,
    		formcheck_group_binding,
    		formcheck_value_binding,
    		blur_handler_5,
    		change_handler_5,
    		focus_handler_5,
    		input_handler_5,
    		keydown_handler_5,
    		keypress_handler_5,
    		keyup_handler_5,
    		input_input_handler_4,
    		input_binding_5,
    		input_input_handler_5,
    		input_binding_6,
    		input_input_handler_6,
    		input_binding_7,
    		input_input_handler_7,
    		input_binding_8,
    		input_input_handler_8,
    		input_binding_9,
    		input_input_handler_9,
    		input_binding_10,
    		input_input_handler_10,
    		input_binding_11,
    		input_input_handler_11,
    		input_binding_12,
    		input_change_input_handler,
    		input_binding_13,
    		input_input_handler_12,
    		input_binding_14,
    		input_input_handler_13,
    		input_binding_15,
    		input_input_handler_14,
    		input_binding_16,
    		textarea_input_handler,
    		textarea_binding,
    		select_change_handler,
    		select_binding,
    		$$scope
    	];
    }

    class Input extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$d,
    			create_fragment$d,
    			safe_not_equal,
    			{
    				class: 7,
    				bsSize: 0,
    				checked: 2,
    				color: 22,
    				disabled: 8,
    				feedback: 9,
    				files: 3,
    				group: 4,
    				inner: 5,
    				invalid: 10,
    				label: 11,
    				multiple: 12,
    				name: 13,
    				placeholder: 14,
    				plaintext: 23,
    				readonly: 15,
    				size: 1,
    				type: 16,
    				valid: 17,
    				value: 6
    			},
    			null,
    			[-1, -1, -1, -1, -1, -1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Input",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get class() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get bsSize() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bsSize(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get checked() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set checked(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get feedback() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set feedback(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get files() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set files(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get group() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set group(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inner() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inner(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get invalid() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set invalid(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get multiple() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set multiple(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get plaintext() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set plaintext(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get readonly() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set readonly(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get valid() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set valid(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/Nav.svelte generated by Svelte v3.48.0 */
    const file$9 = "node_modules/sveltestrap/src/Nav.svelte";

    function create_fragment$c(ctx) {
    	let ul;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[12].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);
    	let ul_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let ul_data = {};

    	for (let i = 0; i < ul_levels.length; i += 1) {
    		ul_data = assign(ul_data, ul_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");
    			if (default_slot) default_slot.c();
    			set_attributes(ul, ul_data);
    			add_location(ul, file$9, 39, 0, 941);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			if (default_slot) {
    				default_slot.m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[11], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(ul, ul_data = get_spread_update(ul_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function getVerticalClass(vertical) {
    	if (vertical === false) {
    		return false;
    	} else if (vertical === true || vertical === 'xs') {
    		return 'flex-column';
    	}

    	return `flex-${vertical}-column`;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let classes;

    	const omit_props_names = [
    		"class","tabs","pills","vertical","horizontal","justified","fill","navbar","card"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Nav', slots, ['default']);
    	let { class: className = '' } = $$props;
    	let { tabs = false } = $$props;
    	let { pills = false } = $$props;
    	let { vertical = false } = $$props;
    	let { horizontal = '' } = $$props;
    	let { justified = false } = $$props;
    	let { fill = false } = $$props;
    	let { navbar = false } = $$props;
    	let { card = false } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('tabs' in $$new_props) $$invalidate(3, tabs = $$new_props.tabs);
    		if ('pills' in $$new_props) $$invalidate(4, pills = $$new_props.pills);
    		if ('vertical' in $$new_props) $$invalidate(5, vertical = $$new_props.vertical);
    		if ('horizontal' in $$new_props) $$invalidate(6, horizontal = $$new_props.horizontal);
    		if ('justified' in $$new_props) $$invalidate(7, justified = $$new_props.justified);
    		if ('fill' in $$new_props) $$invalidate(8, fill = $$new_props.fill);
    		if ('navbar' in $$new_props) $$invalidate(9, navbar = $$new_props.navbar);
    		if ('card' in $$new_props) $$invalidate(10, card = $$new_props.card);
    		if ('$$scope' in $$new_props) $$invalidate(11, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		tabs,
    		pills,
    		vertical,
    		horizontal,
    		justified,
    		fill,
    		navbar,
    		card,
    		getVerticalClass,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(2, className = $$new_props.className);
    		if ('tabs' in $$props) $$invalidate(3, tabs = $$new_props.tabs);
    		if ('pills' in $$props) $$invalidate(4, pills = $$new_props.pills);
    		if ('vertical' in $$props) $$invalidate(5, vertical = $$new_props.vertical);
    		if ('horizontal' in $$props) $$invalidate(6, horizontal = $$new_props.horizontal);
    		if ('justified' in $$props) $$invalidate(7, justified = $$new_props.justified);
    		if ('fill' in $$props) $$invalidate(8, fill = $$new_props.fill);
    		if ('navbar' in $$props) $$invalidate(9, navbar = $$new_props.navbar);
    		if ('card' in $$props) $$invalidate(10, card = $$new_props.card);
    		if ('classes' in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, navbar, horizontal, vertical, tabs, card, pills, justified, fill*/ 2044) {
    			$$invalidate(0, classes = classnames(className, navbar ? 'navbar-nav' : 'nav', horizontal ? `justify-content-${horizontal}` : false, getVerticalClass(vertical), {
    				'nav-tabs': tabs,
    				'card-header-tabs': card && tabs,
    				'nav-pills': pills,
    				'card-header-pills': card && pills,
    				'nav-justified': justified,
    				'nav-fill': fill
    			}));
    		}
    	};

    	return [
    		classes,
    		$$restProps,
    		className,
    		tabs,
    		pills,
    		vertical,
    		horizontal,
    		justified,
    		fill,
    		navbar,
    		card,
    		$$scope,
    		slots
    	];
    }

    class Nav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {
    			class: 2,
    			tabs: 3,
    			pills: 4,
    			vertical: 5,
    			horizontal: 6,
    			justified: 7,
    			fill: 8,
    			navbar: 9,
    			card: 10
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Nav",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get class() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tabs() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tabs(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pills() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pills(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get vertical() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set vertical(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get horizontal() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set horizontal(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get justified() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set justified(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fill() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fill(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get navbar() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set navbar(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get card() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set card(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/Navbar.svelte generated by Svelte v3.48.0 */
    const file$8 = "node_modules/sveltestrap/src/Navbar.svelte";

    // (44:2) {:else}
    function create_else_block(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[11], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(44:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (40:2) {#if container}
    function create_if_block(ctx) {
    	let container_1;
    	let current;

    	container_1 = new Container({
    			props: {
    				fluid: /*container*/ ctx[0] === 'fluid',
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(container_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(container_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const container_1_changes = {};
    			if (dirty & /*container*/ 1) container_1_changes.fluid = /*container*/ ctx[0] === 'fluid';

    			if (dirty & /*$$scope*/ 2048) {
    				container_1_changes.$$scope = { dirty, ctx };
    			}

    			container_1.$set(container_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(container_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(container_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(container_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(40:2) {#if container}",
    		ctx
    	});

    	return block;
    }

    // (41:4) <Container fluid={container === 'fluid'}>
    function create_default_slot$3(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[11], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(41:4) <Container fluid={container === 'fluid'}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let nav;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*container*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let nav_levels = [/*$$restProps*/ ctx[2], { class: /*classes*/ ctx[1] }];
    	let nav_data = {};

    	for (let i = 0; i < nav_levels.length; i += 1) {
    		nav_data = assign(nav_data, nav_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			if_block.c();
    			set_attributes(nav, nav_data);
    			add_location(nav, file$8, 38, 0, 889);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			if_blocks[current_block_type_index].m(nav, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(nav, null);
    			}

    			set_attributes(nav, nav_data = get_spread_update(nav_levels, [
    				dirty & /*$$restProps*/ 4 && /*$$restProps*/ ctx[2],
    				(!current || dirty & /*classes*/ 2) && { class: /*classes*/ ctx[1] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function getExpandClass(expand) {
    	if (expand === false) {
    		return false;
    	} else if (expand === true || expand === 'xs') {
    		return 'navbar-expand';
    	}

    	return `navbar-expand-${expand}`;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","container","color","dark","expand","fixed","light","sticky"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Navbar', slots, ['default']);
    	setContext('navbar', { inNavbar: true });
    	let { class: className = '' } = $$props;
    	let { container = 'fluid' } = $$props;
    	let { color = '' } = $$props;
    	let { dark = false } = $$props;
    	let { expand = '' } = $$props;
    	let { fixed = '' } = $$props;
    	let { light = false } = $$props;
    	let { sticky = '' } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(2, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(3, className = $$new_props.class);
    		if ('container' in $$new_props) $$invalidate(0, container = $$new_props.container);
    		if ('color' in $$new_props) $$invalidate(4, color = $$new_props.color);
    		if ('dark' in $$new_props) $$invalidate(5, dark = $$new_props.dark);
    		if ('expand' in $$new_props) $$invalidate(6, expand = $$new_props.expand);
    		if ('fixed' in $$new_props) $$invalidate(7, fixed = $$new_props.fixed);
    		if ('light' in $$new_props) $$invalidate(8, light = $$new_props.light);
    		if ('sticky' in $$new_props) $$invalidate(9, sticky = $$new_props.sticky);
    		if ('$$scope' in $$new_props) $$invalidate(11, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		Container,
    		setContext,
    		className,
    		container,
    		color,
    		dark,
    		expand,
    		fixed,
    		light,
    		sticky,
    		getExpandClass,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(3, className = $$new_props.className);
    		if ('container' in $$props) $$invalidate(0, container = $$new_props.container);
    		if ('color' in $$props) $$invalidate(4, color = $$new_props.color);
    		if ('dark' in $$props) $$invalidate(5, dark = $$new_props.dark);
    		if ('expand' in $$props) $$invalidate(6, expand = $$new_props.expand);
    		if ('fixed' in $$props) $$invalidate(7, fixed = $$new_props.fixed);
    		if ('light' in $$props) $$invalidate(8, light = $$new_props.light);
    		if ('sticky' in $$props) $$invalidate(9, sticky = $$new_props.sticky);
    		if ('classes' in $$props) $$invalidate(1, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, expand, light, dark, color, fixed, sticky*/ 1016) {
    			$$invalidate(1, classes = classnames(className, 'navbar', getExpandClass(expand), {
    				'navbar-light': light,
    				'navbar-dark': dark,
    				[`bg-${color}`]: color,
    				[`fixed-${fixed}`]: fixed,
    				[`sticky-${sticky}`]: sticky
    			}));
    		}
    	};

    	return [
    		container,
    		classes,
    		$$restProps,
    		className,
    		color,
    		dark,
    		expand,
    		fixed,
    		light,
    		sticky,
    		slots,
    		$$scope
    	];
    }

    class Navbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {
    			class: 3,
    			container: 0,
    			color: 4,
    			dark: 5,
    			expand: 6,
    			fixed: 7,
    			light: 8,
    			sticky: 9
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navbar",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get class() {
    		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get container() {
    		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set container(value) {
    		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dark() {
    		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dark(value) {
    		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get expand() {
    		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set expand(value) {
    		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fixed() {
    		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fixed(value) {
    		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get light() {
    		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set light(value) {
    		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sticky() {
    		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sticky(value) {
    		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/NavItem.svelte generated by Svelte v3.48.0 */
    const file$7 = "node_modules/sveltestrap/src/NavItem.svelte";

    function create_fragment$a(ctx) {
    	let li;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);
    	let li_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let li_data = {};

    	for (let i = 0; i < li_levels.length; i += 1) {
    		li_data = assign(li_data, li_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			if (default_slot) default_slot.c();
    			set_attributes(li, li_data);
    			add_location(li, file$7, 10, 0, 219);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);

    			if (default_slot) {
    				default_slot.m(li, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(li, li_data = get_spread_update(li_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","active"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NavItem', slots, ['default']);
    	let { class: className = '' } = $$props;
    	let { active = false } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('active' in $$new_props) $$invalidate(3, active = $$new_props.active);
    		if ('$$scope' in $$new_props) $$invalidate(4, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ classnames, className, active, classes });

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(2, className = $$new_props.className);
    		if ('active' in $$props) $$invalidate(3, active = $$new_props.active);
    		if ('classes' in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, active*/ 12) {
    			$$invalidate(0, classes = classnames(className, 'nav-item', active ? 'active' : false));
    		}
    	};

    	return [classes, $$restProps, className, active, $$scope, slots];
    }

    class NavItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { class: 2, active: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NavItem",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get class() {
    		throw new Error("<NavItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<NavItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<NavItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<NavItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/NavLink.svelte generated by Svelte v3.48.0 */
    const file$6 = "node_modules/sveltestrap/src/NavLink.svelte";

    function create_fragment$9(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);

    	let a_levels = [
    		/*$$restProps*/ ctx[3],
    		{ href: /*href*/ ctx[0] },
    		{ class: /*classes*/ ctx[1] }
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file$6, 27, 0, 472);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(a, "click", /*click_handler*/ ctx[9], false, false, false),
    					listen_dev(a, "click", /*handleClick*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 128)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[7],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3],
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
    				(!current || dirty & /*classes*/ 2) && { class: /*classes*/ ctx[1] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","disabled","active","href"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NavLink', slots, ['default']);
    	let { class: className = '' } = $$props;
    	let { disabled = false } = $$props;
    	let { active = false } = $$props;
    	let { href = '#' } = $$props;

    	function handleClick(e) {
    		if (disabled) {
    			e.preventDefault();
    			e.stopImmediatePropagation();
    			return;
    		}

    		if (href === '#') {
    			e.preventDefault();
    		}
    	}

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(4, className = $$new_props.class);
    		if ('disabled' in $$new_props) $$invalidate(5, disabled = $$new_props.disabled);
    		if ('active' in $$new_props) $$invalidate(6, active = $$new_props.active);
    		if ('href' in $$new_props) $$invalidate(0, href = $$new_props.href);
    		if ('$$scope' in $$new_props) $$invalidate(7, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		disabled,
    		active,
    		href,
    		handleClick,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(4, className = $$new_props.className);
    		if ('disabled' in $$props) $$invalidate(5, disabled = $$new_props.disabled);
    		if ('active' in $$props) $$invalidate(6, active = $$new_props.active);
    		if ('href' in $$props) $$invalidate(0, href = $$new_props.href);
    		if ('classes' in $$props) $$invalidate(1, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, disabled, active*/ 112) {
    			$$invalidate(1, classes = classnames(className, 'nav-link', { disabled, active }));
    		}
    	};

    	return [
    		href,
    		classes,
    		handleClick,
    		$$restProps,
    		className,
    		disabled,
    		active,
    		$$scope,
    		slots,
    		click_handler
    	];
    }

    class NavLink extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {
    			class: 4,
    			disabled: 5,
    			active: 6,
    			href: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NavLink",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get class() {
    		throw new Error("<NavLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<NavLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<NavLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<NavLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<NavLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<NavLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<NavLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<NavLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/NavbarBrand.svelte generated by Svelte v3.48.0 */
    const file$5 = "node_modules/sveltestrap/src/NavbarBrand.svelte";

    function create_fragment$8(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	let a_levels = [
    		/*$$restProps*/ ctx[2],
    		{ class: /*classes*/ ctx[1] },
    		{ href: /*href*/ ctx[0] }
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file$5, 10, 0, 192);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*click_handler*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				dirty & /*$$restProps*/ 4 && /*$$restProps*/ ctx[2],
    				(!current || dirty & /*classes*/ 2) && { class: /*classes*/ ctx[1] },
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","href"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NavbarBrand', slots, ['default']);
    	let { class: className = '' } = $$props;
    	let { href = '/' } = $$props;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(2, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(3, className = $$new_props.class);
    		if ('href' in $$new_props) $$invalidate(0, href = $$new_props.href);
    		if ('$$scope' in $$new_props) $$invalidate(4, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ classnames, className, href, classes });

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(3, className = $$new_props.className);
    		if ('href' in $$props) $$invalidate(0, href = $$new_props.href);
    		if ('classes' in $$props) $$invalidate(1, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className*/ 8) {
    			$$invalidate(1, classes = classnames(className, 'navbar-brand'));
    		}
    	};

    	return [href, classes, $$restProps, className, $$scope, slots, click_handler];
    }

    class NavbarBrand extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { class: 3, href: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NavbarBrand",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get class() {
    		throw new Error("<NavbarBrand>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<NavbarBrand>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<NavbarBrand>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<NavbarBrand>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/NavbarToggler.svelte generated by Svelte v3.48.0 */
    const file$4 = "node_modules/sveltestrap/src/NavbarToggler.svelte";

    // (13:8)      
    function fallback_block(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			attr_dev(span, "class", "navbar-toggler-icon");
    			add_location(span, file$4, 13, 4, 274);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(13:8)      ",
    		ctx
    	});

    	return block;
    }

    // (12:0) <Button {...$$restProps} on:click class={classes}>
    function create_default_slot$2(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);
    	const default_slot_or_fallback = default_slot || fallback_block(ctx);

    	const block = {
    		c: function create() {
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(12:0) <Button {...$$restProps} on:click class={classes}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let button;
    	let current;
    	const button_spread_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];

    	let button_props = {
    		$$slots: { default: [create_default_slot$2] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < button_spread_levels.length; i += 1) {
    		button_props = assign(button_props, button_spread_levels[i]);
    	}

    	button = new Button({ props: button_props, $$inline: true });
    	button.$on("click", /*click_handler*/ ctx[4]);

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const button_changes = (dirty & /*$$restProps, classes*/ 3)
    			? get_spread_update(button_spread_levels, [
    					dirty & /*$$restProps*/ 2 && get_spread_object(/*$$restProps*/ ctx[1]),
    					dirty & /*classes*/ 1 && { class: /*classes*/ ctx[0] }
    				])
    			: {};

    			if (dirty & /*$$scope*/ 32) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NavbarToggler', slots, ['default']);
    	let { class: className = '' } = $$props;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('$$scope' in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ classnames, Button, className, classes });

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(2, className = $$new_props.className);
    		if ('classes' in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className*/ 4) {
    			$$invalidate(0, classes = classnames(className, 'navbar-toggler'));
    		}
    	};

    	return [classes, $$restProps, className, slots, click_handler, $$scope];
    }

    class NavbarToggler extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { class: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NavbarToggler",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get class() {
    		throw new Error("<NavbarToggler>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<NavbarToggler>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/Row.svelte generated by Svelte v3.48.0 */
    const file$3 = "node_modules/sveltestrap/src/Row.svelte";

    function create_fragment$6(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);
    	let div_levels = [/*$$restProps*/ ctx[2], { class: /*classes*/ ctx[1] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$3, 40, 0, 1012);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[9](div);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 128)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[7],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 4 && /*$$restProps*/ ctx[2],
    				(!current || dirty & /*classes*/ 2) && { class: /*classes*/ ctx[1] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[9](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function getCols(cols) {
    	const colsValue = parseInt(cols);

    	if (!isNaN(colsValue)) {
    		if (colsValue > 0) {
    			return [`row-cols-${colsValue}`];
    		}
    	} else if (typeof cols === 'object') {
    		return ['xs', 'sm', 'md', 'lg', 'xl'].map(colWidth => {
    			const isXs = colWidth === 'xs';
    			const colSizeInterfix = isXs ? '-' : `-${colWidth}-`;
    			const value = cols[colWidth];

    			if (typeof value === 'number' && value > 0) {
    				return `row-cols${colSizeInterfix}${value}`;
    			}

    			return null;
    		}).filter(value => !!value);
    	}

    	return [];
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","noGutters","form","cols","inner"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Row', slots, ['default']);
    	let { class: className = '' } = $$props;
    	let { noGutters = false } = $$props;
    	let { form = false } = $$props;
    	let { cols = 0 } = $$props;
    	let { inner = undefined } = $$props;

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(0, inner);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(2, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(3, className = $$new_props.class);
    		if ('noGutters' in $$new_props) $$invalidate(4, noGutters = $$new_props.noGutters);
    		if ('form' in $$new_props) $$invalidate(5, form = $$new_props.form);
    		if ('cols' in $$new_props) $$invalidate(6, cols = $$new_props.cols);
    		if ('inner' in $$new_props) $$invalidate(0, inner = $$new_props.inner);
    		if ('$$scope' in $$new_props) $$invalidate(7, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		noGutters,
    		form,
    		cols,
    		inner,
    		getCols,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(3, className = $$new_props.className);
    		if ('noGutters' in $$props) $$invalidate(4, noGutters = $$new_props.noGutters);
    		if ('form' in $$props) $$invalidate(5, form = $$new_props.form);
    		if ('cols' in $$props) $$invalidate(6, cols = $$new_props.cols);
    		if ('inner' in $$props) $$invalidate(0, inner = $$new_props.inner);
    		if ('classes' in $$props) $$invalidate(1, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, noGutters, form, cols*/ 120) {
    			$$invalidate(1, classes = classnames(className, noGutters ? 'gx-0' : null, form ? 'form-row' : 'row', ...getCols(cols)));
    		}
    	};

    	return [
    		inner,
    		classes,
    		$$restProps,
    		className,
    		noGutters,
    		form,
    		cols,
    		$$scope,
    		slots,
    		div_binding
    	];
    }

    class Row extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {
    			class: 3,
    			noGutters: 4,
    			form: 5,
    			cols: 6,
    			inner: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Row",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get class() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noGutters() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noGutters(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get form() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set form(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get cols() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cols(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inner() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inner(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    var page = createCommonjsModule(function (module, exports) {
    (function (global, factory) {
    	module.exports = factory() ;
    }(commonjsGlobal, (function () {
    var isarray = Array.isArray || function (arr) {
      return Object.prototype.toString.call(arr) == '[object Array]';
    };

    /**
     * Expose `pathToRegexp`.
     */
    var pathToRegexp_1 = pathToRegexp;
    var parse_1 = parse;
    var compile_1 = compile;
    var tokensToFunction_1 = tokensToFunction;
    var tokensToRegExp_1 = tokensToRegExp;

    /**
     * The main path matching regexp utility.
     *
     * @type {RegExp}
     */
    var PATH_REGEXP = new RegExp([
      // Match escaped characters that would otherwise appear in future matches.
      // This allows the user to escape special characters that won't transform.
      '(\\\\.)',
      // Match Express-style parameters and un-named parameters with a prefix
      // and optional suffixes. Matches appear as:
      //
      // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
      // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
      // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
      '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^()])+)\\))?|\\(((?:\\\\.|[^()])+)\\))([+*?])?|(\\*))'
    ].join('|'), 'g');

    /**
     * Parse a string for the raw tokens.
     *
     * @param  {String} str
     * @return {Array}
     */
    function parse (str) {
      var tokens = [];
      var key = 0;
      var index = 0;
      var path = '';
      var res;

      while ((res = PATH_REGEXP.exec(str)) != null) {
        var m = res[0];
        var escaped = res[1];
        var offset = res.index;
        path += str.slice(index, offset);
        index = offset + m.length;

        // Ignore already escaped sequences.
        if (escaped) {
          path += escaped[1];
          continue
        }

        // Push the current path onto the tokens.
        if (path) {
          tokens.push(path);
          path = '';
        }

        var prefix = res[2];
        var name = res[3];
        var capture = res[4];
        var group = res[5];
        var suffix = res[6];
        var asterisk = res[7];

        var repeat = suffix === '+' || suffix === '*';
        var optional = suffix === '?' || suffix === '*';
        var delimiter = prefix || '/';
        var pattern = capture || group || (asterisk ? '.*' : '[^' + delimiter + ']+?');

        tokens.push({
          name: name || key++,
          prefix: prefix || '',
          delimiter: delimiter,
          optional: optional,
          repeat: repeat,
          pattern: escapeGroup(pattern)
        });
      }

      // Match any characters still remaining.
      if (index < str.length) {
        path += str.substr(index);
      }

      // If the path exists, push it onto the end.
      if (path) {
        tokens.push(path);
      }

      return tokens
    }

    /**
     * Compile a string to a template function for the path.
     *
     * @param  {String}   str
     * @return {Function}
     */
    function compile (str) {
      return tokensToFunction(parse(str))
    }

    /**
     * Expose a method for transforming tokens into the path function.
     */
    function tokensToFunction (tokens) {
      // Compile all the tokens into regexps.
      var matches = new Array(tokens.length);

      // Compile all the patterns before compilation.
      for (var i = 0; i < tokens.length; i++) {
        if (typeof tokens[i] === 'object') {
          matches[i] = new RegExp('^' + tokens[i].pattern + '$');
        }
      }

      return function (obj) {
        var path = '';
        var data = obj || {};

        for (var i = 0; i < tokens.length; i++) {
          var token = tokens[i];

          if (typeof token === 'string') {
            path += token;

            continue
          }

          var value = data[token.name];
          var segment;

          if (value == null) {
            if (token.optional) {
              continue
            } else {
              throw new TypeError('Expected "' + token.name + '" to be defined')
            }
          }

          if (isarray(value)) {
            if (!token.repeat) {
              throw new TypeError('Expected "' + token.name + '" to not repeat, but received "' + value + '"')
            }

            if (value.length === 0) {
              if (token.optional) {
                continue
              } else {
                throw new TypeError('Expected "' + token.name + '" to not be empty')
              }
            }

            for (var j = 0; j < value.length; j++) {
              segment = encodeURIComponent(value[j]);

              if (!matches[i].test(segment)) {
                throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
              }

              path += (j === 0 ? token.prefix : token.delimiter) + segment;
            }

            continue
          }

          segment = encodeURIComponent(value);

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
          }

          path += token.prefix + segment;
        }

        return path
      }
    }

    /**
     * Escape a regular expression string.
     *
     * @param  {String} str
     * @return {String}
     */
    function escapeString (str) {
      return str.replace(/([.+*?=^!:${}()[\]|\/])/g, '\\$1')
    }

    /**
     * Escape the capturing group by escaping special characters and meaning.
     *
     * @param  {String} group
     * @return {String}
     */
    function escapeGroup (group) {
      return group.replace(/([=!:$\/()])/g, '\\$1')
    }

    /**
     * Attach the keys as a property of the regexp.
     *
     * @param  {RegExp} re
     * @param  {Array}  keys
     * @return {RegExp}
     */
    function attachKeys (re, keys) {
      re.keys = keys;
      return re
    }

    /**
     * Get the flags for a regexp from the options.
     *
     * @param  {Object} options
     * @return {String}
     */
    function flags (options) {
      return options.sensitive ? '' : 'i'
    }

    /**
     * Pull out keys from a regexp.
     *
     * @param  {RegExp} path
     * @param  {Array}  keys
     * @return {RegExp}
     */
    function regexpToRegexp (path, keys) {
      // Use a negative lookahead to match only capturing groups.
      var groups = path.source.match(/\((?!\?)/g);

      if (groups) {
        for (var i = 0; i < groups.length; i++) {
          keys.push({
            name: i,
            prefix: null,
            delimiter: null,
            optional: false,
            repeat: false,
            pattern: null
          });
        }
      }

      return attachKeys(path, keys)
    }

    /**
     * Transform an array into a regexp.
     *
     * @param  {Array}  path
     * @param  {Array}  keys
     * @param  {Object} options
     * @return {RegExp}
     */
    function arrayToRegexp (path, keys, options) {
      var parts = [];

      for (var i = 0; i < path.length; i++) {
        parts.push(pathToRegexp(path[i], keys, options).source);
      }

      var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));

      return attachKeys(regexp, keys)
    }

    /**
     * Create a path regexp from string input.
     *
     * @param  {String} path
     * @param  {Array}  keys
     * @param  {Object} options
     * @return {RegExp}
     */
    function stringToRegexp (path, keys, options) {
      var tokens = parse(path);
      var re = tokensToRegExp(tokens, options);

      // Attach keys back to the regexp.
      for (var i = 0; i < tokens.length; i++) {
        if (typeof tokens[i] !== 'string') {
          keys.push(tokens[i]);
        }
      }

      return attachKeys(re, keys)
    }

    /**
     * Expose a function for taking tokens and returning a RegExp.
     *
     * @param  {Array}  tokens
     * @param  {Array}  keys
     * @param  {Object} options
     * @return {RegExp}
     */
    function tokensToRegExp (tokens, options) {
      options = options || {};

      var strict = options.strict;
      var end = options.end !== false;
      var route = '';
      var lastToken = tokens[tokens.length - 1];
      var endsWithSlash = typeof lastToken === 'string' && /\/$/.test(lastToken);

      // Iterate over the tokens and create our regexp string.
      for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];

        if (typeof token === 'string') {
          route += escapeString(token);
        } else {
          var prefix = escapeString(token.prefix);
          var capture = token.pattern;

          if (token.repeat) {
            capture += '(?:' + prefix + capture + ')*';
          }

          if (token.optional) {
            if (prefix) {
              capture = '(?:' + prefix + '(' + capture + '))?';
            } else {
              capture = '(' + capture + ')?';
            }
          } else {
            capture = prefix + '(' + capture + ')';
          }

          route += capture;
        }
      }

      // In non-strict mode we allow a slash at the end of match. If the path to
      // match already ends with a slash, we remove it for consistency. The slash
      // is valid at the end of a path match, not in the middle. This is important
      // in non-ending mode, where "/test/" shouldn't match "/test//route".
      if (!strict) {
        route = (endsWithSlash ? route.slice(0, -2) : route) + '(?:\\/(?=$))?';
      }

      if (end) {
        route += '$';
      } else {
        // In non-ending mode, we need the capturing groups to match as much as
        // possible by using a positive lookahead to the end or next path segment.
        route += strict && endsWithSlash ? '' : '(?=\\/|$)';
      }

      return new RegExp('^' + route, flags(options))
    }

    /**
     * Normalize the given path string, returning a regular expression.
     *
     * An empty array can be passed in for the keys, which will hold the
     * placeholder key descriptions. For example, using `/user/:id`, `keys` will
     * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
     *
     * @param  {(String|RegExp|Array)} path
     * @param  {Array}                 [keys]
     * @param  {Object}                [options]
     * @return {RegExp}
     */
    function pathToRegexp (path, keys, options) {
      keys = keys || [];

      if (!isarray(keys)) {
        options = keys;
        keys = [];
      } else if (!options) {
        options = {};
      }

      if (path instanceof RegExp) {
        return regexpToRegexp(path, keys)
      }

      if (isarray(path)) {
        return arrayToRegexp(path, keys, options)
      }

      return stringToRegexp(path, keys, options)
    }

    pathToRegexp_1.parse = parse_1;
    pathToRegexp_1.compile = compile_1;
    pathToRegexp_1.tokensToFunction = tokensToFunction_1;
    pathToRegexp_1.tokensToRegExp = tokensToRegExp_1;

    /**
       * Module dependencies.
       */

      

      /**
       * Short-cuts for global-object checks
       */

      var hasDocument = ('undefined' !== typeof document);
      var hasWindow = ('undefined' !== typeof window);
      var hasHistory = ('undefined' !== typeof history);
      var hasProcess = typeof process !== 'undefined';

      /**
       * Detect click event
       */
      var clickEvent = hasDocument && document.ontouchstart ? 'touchstart' : 'click';

      /**
       * To work properly with the URL
       * history.location generated polyfill in https://github.com/devote/HTML5-History-API
       */

      var isLocation = hasWindow && !!(window.history.location || window.location);

      /**
       * The page instance
       * @api private
       */
      function Page() {
        // public things
        this.callbacks = [];
        this.exits = [];
        this.current = '';
        this.len = 0;

        // private things
        this._decodeURLComponents = true;
        this._base = '';
        this._strict = false;
        this._running = false;
        this._hashbang = false;

        // bound functions
        this.clickHandler = this.clickHandler.bind(this);
        this._onpopstate = this._onpopstate.bind(this);
      }

      /**
       * Configure the instance of page. This can be called multiple times.
       *
       * @param {Object} options
       * @api public
       */

      Page.prototype.configure = function(options) {
        var opts = options || {};

        this._window = opts.window || (hasWindow && window);
        this._decodeURLComponents = opts.decodeURLComponents !== false;
        this._popstate = opts.popstate !== false && hasWindow;
        this._click = opts.click !== false && hasDocument;
        this._hashbang = !!opts.hashbang;

        var _window = this._window;
        if(this._popstate) {
          _window.addEventListener('popstate', this._onpopstate, false);
        } else if(hasWindow) {
          _window.removeEventListener('popstate', this._onpopstate, false);
        }

        if (this._click) {
          _window.document.addEventListener(clickEvent, this.clickHandler, false);
        } else if(hasDocument) {
          _window.document.removeEventListener(clickEvent, this.clickHandler, false);
        }

        if(this._hashbang && hasWindow && !hasHistory) {
          _window.addEventListener('hashchange', this._onpopstate, false);
        } else if(hasWindow) {
          _window.removeEventListener('hashchange', this._onpopstate, false);
        }
      };

      /**
       * Get or set basepath to `path`.
       *
       * @param {string} path
       * @api public
       */

      Page.prototype.base = function(path) {
        if (0 === arguments.length) return this._base;
        this._base = path;
      };

      /**
       * Gets the `base`, which depends on whether we are using History or
       * hashbang routing.

       * @api private
       */
      Page.prototype._getBase = function() {
        var base = this._base;
        if(!!base) return base;
        var loc = hasWindow && this._window && this._window.location;

        if(hasWindow && this._hashbang && loc && loc.protocol === 'file:') {
          base = loc.pathname;
        }

        return base;
      };

      /**
       * Get or set strict path matching to `enable`
       *
       * @param {boolean} enable
       * @api public
       */

      Page.prototype.strict = function(enable) {
        if (0 === arguments.length) return this._strict;
        this._strict = enable;
      };


      /**
       * Bind with the given `options`.
       *
       * Options:
       *
       *    - `click` bind to click events [true]
       *    - `popstate` bind to popstate [true]
       *    - `dispatch` perform initial dispatch [true]
       *
       * @param {Object} options
       * @api public
       */

      Page.prototype.start = function(options) {
        var opts = options || {};
        this.configure(opts);

        if (false === opts.dispatch) return;
        this._running = true;

        var url;
        if(isLocation) {
          var window = this._window;
          var loc = window.location;

          if(this._hashbang && ~loc.hash.indexOf('#!')) {
            url = loc.hash.substr(2) + loc.search;
          } else if (this._hashbang) {
            url = loc.search + loc.hash;
          } else {
            url = loc.pathname + loc.search + loc.hash;
          }
        }

        this.replace(url, null, true, opts.dispatch);
      };

      /**
       * Unbind click and popstate event handlers.
       *
       * @api public
       */

      Page.prototype.stop = function() {
        if (!this._running) return;
        this.current = '';
        this.len = 0;
        this._running = false;

        var window = this._window;
        this._click && window.document.removeEventListener(clickEvent, this.clickHandler, false);
        hasWindow && window.removeEventListener('popstate', this._onpopstate, false);
        hasWindow && window.removeEventListener('hashchange', this._onpopstate, false);
      };

      /**
       * Show `path` with optional `state` object.
       *
       * @param {string} path
       * @param {Object=} state
       * @param {boolean=} dispatch
       * @param {boolean=} push
       * @return {!Context}
       * @api public
       */

      Page.prototype.show = function(path, state, dispatch, push) {
        var ctx = new Context(path, state, this),
          prev = this.prevContext;
        this.prevContext = ctx;
        this.current = ctx.path;
        if (false !== dispatch) this.dispatch(ctx, prev);
        if (false !== ctx.handled && false !== push) ctx.pushState();
        return ctx;
      };

      /**
       * Goes back in the history
       * Back should always let the current route push state and then go back.
       *
       * @param {string} path - fallback path to go back if no more history exists, if undefined defaults to page.base
       * @param {Object=} state
       * @api public
       */

      Page.prototype.back = function(path, state) {
        var page = this;
        if (this.len > 0) {
          var window = this._window;
          // this may need more testing to see if all browsers
          // wait for the next tick to go back in history
          hasHistory && window.history.back();
          this.len--;
        } else if (path) {
          setTimeout(function() {
            page.show(path, state);
          });
        } else {
          setTimeout(function() {
            page.show(page._getBase(), state);
          });
        }
      };

      /**
       * Register route to redirect from one path to other
       * or just redirect to another route
       *
       * @param {string} from - if param 'to' is undefined redirects to 'from'
       * @param {string=} to
       * @api public
       */
      Page.prototype.redirect = function(from, to) {
        var inst = this;

        // Define route from a path to another
        if ('string' === typeof from && 'string' === typeof to) {
          page.call(this, from, function(e) {
            setTimeout(function() {
              inst.replace(/** @type {!string} */ (to));
            }, 0);
          });
        }

        // Wait for the push state and replace it with another
        if ('string' === typeof from && 'undefined' === typeof to) {
          setTimeout(function() {
            inst.replace(from);
          }, 0);
        }
      };

      /**
       * Replace `path` with optional `state` object.
       *
       * @param {string} path
       * @param {Object=} state
       * @param {boolean=} init
       * @param {boolean=} dispatch
       * @return {!Context}
       * @api public
       */


      Page.prototype.replace = function(path, state, init, dispatch) {
        var ctx = new Context(path, state, this),
          prev = this.prevContext;
        this.prevContext = ctx;
        this.current = ctx.path;
        ctx.init = init;
        ctx.save(); // save before dispatching, which may redirect
        if (false !== dispatch) this.dispatch(ctx, prev);
        return ctx;
      };

      /**
       * Dispatch the given `ctx`.
       *
       * @param {Context} ctx
       * @api private
       */

      Page.prototype.dispatch = function(ctx, prev) {
        var i = 0, j = 0, page = this;

        function nextExit() {
          var fn = page.exits[j++];
          if (!fn) return nextEnter();
          fn(prev, nextExit);
        }

        function nextEnter() {
          var fn = page.callbacks[i++];

          if (ctx.path !== page.current) {
            ctx.handled = false;
            return;
          }
          if (!fn) return unhandled.call(page, ctx);
          fn(ctx, nextEnter);
        }

        if (prev) {
          nextExit();
        } else {
          nextEnter();
        }
      };

      /**
       * Register an exit route on `path` with
       * callback `fn()`, which will be called
       * on the previous context when a new
       * page is visited.
       */
      Page.prototype.exit = function(path, fn) {
        if (typeof path === 'function') {
          return this.exit('*', path);
        }

        var route = new Route(path, null, this);
        for (var i = 1; i < arguments.length; ++i) {
          this.exits.push(route.middleware(arguments[i]));
        }
      };

      /**
       * Handle "click" events.
       */

      /* jshint +W054 */
      Page.prototype.clickHandler = function(e) {
        if (1 !== this._which(e)) return;

        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        if (e.defaultPrevented) return;

        // ensure link
        // use shadow dom when available if not, fall back to composedPath()
        // for browsers that only have shady
        var el = e.target;
        var eventPath = e.path || (e.composedPath ? e.composedPath() : null);

        if(eventPath) {
          for (var i = 0; i < eventPath.length; i++) {
            if (!eventPath[i].nodeName) continue;
            if (eventPath[i].nodeName.toUpperCase() !== 'A') continue;
            if (!eventPath[i].href) continue;

            el = eventPath[i];
            break;
          }
        }

        // continue ensure link
        // el.nodeName for svg links are 'a' instead of 'A'
        while (el && 'A' !== el.nodeName.toUpperCase()) el = el.parentNode;
        if (!el || 'A' !== el.nodeName.toUpperCase()) return;

        // check if link is inside an svg
        // in this case, both href and target are always inside an object
        var svg = (typeof el.href === 'object') && el.href.constructor.name === 'SVGAnimatedString';

        // Ignore if tag has
        // 1. "download" attribute
        // 2. rel="external" attribute
        if (el.hasAttribute('download') || el.getAttribute('rel') === 'external') return;

        // ensure non-hash for the same path
        var link = el.getAttribute('href');
        if(!this._hashbang && this._samePath(el) && (el.hash || '#' === link)) return;

        // Check for mailto: in the href
        if (link && link.indexOf('mailto:') > -1) return;

        // check target
        // svg target is an object and its desired value is in .baseVal property
        if (svg ? el.target.baseVal : el.target) return;

        // x-origin
        // note: svg links that are not relative don't call click events (and skip page.js)
        // consequently, all svg links tested inside page.js are relative and in the same origin
        if (!svg && !this.sameOrigin(el.href)) return;

        // rebuild path
        // There aren't .pathname and .search properties in svg links, so we use href
        // Also, svg href is an object and its desired value is in .baseVal property
        var path = svg ? el.href.baseVal : (el.pathname + el.search + (el.hash || ''));

        path = path[0] !== '/' ? '/' + path : path;

        // strip leading "/[drive letter]:" on NW.js on Windows
        if (hasProcess && path.match(/^\/[a-zA-Z]:\//)) {
          path = path.replace(/^\/[a-zA-Z]:\//, '/');
        }

        // same page
        var orig = path;
        var pageBase = this._getBase();

        if (path.indexOf(pageBase) === 0) {
          path = path.substr(pageBase.length);
        }

        if (this._hashbang) path = path.replace('#!', '');

        if (pageBase && orig === path && (!isLocation || this._window.location.protocol !== 'file:')) {
          return;
        }

        e.preventDefault();
        this.show(orig);
      };

      /**
       * Handle "populate" events.
       * @api private
       */

      Page.prototype._onpopstate = (function () {
        var loaded = false;
        if ( ! hasWindow ) {
          return function () {};
        }
        if (hasDocument && document.readyState === 'complete') {
          loaded = true;
        } else {
          window.addEventListener('load', function() {
            setTimeout(function() {
              loaded = true;
            }, 0);
          });
        }
        return function onpopstate(e) {
          if (!loaded) return;
          var page = this;
          if (e.state) {
            var path = e.state.path;
            page.replace(path, e.state);
          } else if (isLocation) {
            var loc = page._window.location;
            page.show(loc.pathname + loc.search + loc.hash, undefined, undefined, false);
          }
        };
      })();

      /**
       * Event button.
       */
      Page.prototype._which = function(e) {
        e = e || (hasWindow && this._window.event);
        return null == e.which ? e.button : e.which;
      };

      /**
       * Convert to a URL object
       * @api private
       */
      Page.prototype._toURL = function(href) {
        var window = this._window;
        if(typeof URL === 'function' && isLocation) {
          return new URL(href, window.location.toString());
        } else if (hasDocument) {
          var anc = window.document.createElement('a');
          anc.href = href;
          return anc;
        }
      };

      /**
       * Check if `href` is the same origin.
       * @param {string} href
       * @api public
       */
      Page.prototype.sameOrigin = function(href) {
        if(!href || !isLocation) return false;

        var url = this._toURL(href);
        var window = this._window;

        var loc = window.location;

        /*
           When the port is the default http port 80 for http, or 443 for
           https, internet explorer 11 returns an empty string for loc.port,
           so we need to compare loc.port with an empty string if url.port
           is the default port 80 or 443.
           Also the comparition with `port` is changed from `===` to `==` because
           `port` can be a string sometimes. This only applies to ie11.
        */
        return loc.protocol === url.protocol &&
          loc.hostname === url.hostname &&
          (loc.port === url.port || loc.port === '' && (url.port == 80 || url.port == 443)); // jshint ignore:line
      };

      /**
       * @api private
       */
      Page.prototype._samePath = function(url) {
        if(!isLocation) return false;
        var window = this._window;
        var loc = window.location;
        return url.pathname === loc.pathname &&
          url.search === loc.search;
      };

      /**
       * Remove URL encoding from the given `str`.
       * Accommodates whitespace in both x-www-form-urlencoded
       * and regular percent-encoded form.
       *
       * @param {string} val - URL component to decode
       * @api private
       */
      Page.prototype._decodeURLEncodedURIComponent = function(val) {
        if (typeof val !== 'string') { return val; }
        return this._decodeURLComponents ? decodeURIComponent(val.replace(/\+/g, ' ')) : val;
      };

      /**
       * Create a new `page` instance and function
       */
      function createPage() {
        var pageInstance = new Page();

        function pageFn(/* args */) {
          return page.apply(pageInstance, arguments);
        }

        // Copy all of the things over. In 2.0 maybe we use setPrototypeOf
        pageFn.callbacks = pageInstance.callbacks;
        pageFn.exits = pageInstance.exits;
        pageFn.base = pageInstance.base.bind(pageInstance);
        pageFn.strict = pageInstance.strict.bind(pageInstance);
        pageFn.start = pageInstance.start.bind(pageInstance);
        pageFn.stop = pageInstance.stop.bind(pageInstance);
        pageFn.show = pageInstance.show.bind(pageInstance);
        pageFn.back = pageInstance.back.bind(pageInstance);
        pageFn.redirect = pageInstance.redirect.bind(pageInstance);
        pageFn.replace = pageInstance.replace.bind(pageInstance);
        pageFn.dispatch = pageInstance.dispatch.bind(pageInstance);
        pageFn.exit = pageInstance.exit.bind(pageInstance);
        pageFn.configure = pageInstance.configure.bind(pageInstance);
        pageFn.sameOrigin = pageInstance.sameOrigin.bind(pageInstance);
        pageFn.clickHandler = pageInstance.clickHandler.bind(pageInstance);

        pageFn.create = createPage;

        Object.defineProperty(pageFn, 'len', {
          get: function(){
            return pageInstance.len;
          },
          set: function(val) {
            pageInstance.len = val;
          }
        });

        Object.defineProperty(pageFn, 'current', {
          get: function(){
            return pageInstance.current;
          },
          set: function(val) {
            pageInstance.current = val;
          }
        });

        // In 2.0 these can be named exports
        pageFn.Context = Context;
        pageFn.Route = Route;

        return pageFn;
      }

      /**
       * Register `path` with callback `fn()`,
       * or route `path`, or redirection,
       * or `page.start()`.
       *
       *   page(fn);
       *   page('*', fn);
       *   page('/user/:id', load, user);
       *   page('/user/' + user.id, { some: 'thing' });
       *   page('/user/' + user.id);
       *   page('/from', '/to')
       *   page();
       *
       * @param {string|!Function|!Object} path
       * @param {Function=} fn
       * @api public
       */

      function page(path, fn) {
        // <callback>
        if ('function' === typeof path) {
          return page.call(this, '*', path);
        }

        // route <path> to <callback ...>
        if ('function' === typeof fn) {
          var route = new Route(/** @type {string} */ (path), null, this);
          for (var i = 1; i < arguments.length; ++i) {
            this.callbacks.push(route.middleware(arguments[i]));
          }
          // show <path> with [state]
        } else if ('string' === typeof path) {
          this['string' === typeof fn ? 'redirect' : 'show'](path, fn);
          // start [options]
        } else {
          this.start(path);
        }
      }

      /**
       * Unhandled `ctx`. When it's not the initial
       * popstate then redirect. If you wish to handle
       * 404s on your own use `page('*', callback)`.
       *
       * @param {Context} ctx
       * @api private
       */
      function unhandled(ctx) {
        if (ctx.handled) return;
        var current;
        var page = this;
        var window = page._window;

        if (page._hashbang) {
          current = isLocation && this._getBase() + window.location.hash.replace('#!', '');
        } else {
          current = isLocation && window.location.pathname + window.location.search;
        }

        if (current === ctx.canonicalPath) return;
        page.stop();
        ctx.handled = false;
        isLocation && (window.location.href = ctx.canonicalPath);
      }

      /**
       * Escapes RegExp characters in the given string.
       *
       * @param {string} s
       * @api private
       */
      function escapeRegExp(s) {
        return s.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1');
      }

      /**
       * Initialize a new "request" `Context`
       * with the given `path` and optional initial `state`.
       *
       * @constructor
       * @param {string} path
       * @param {Object=} state
       * @api public
       */

      function Context(path, state, pageInstance) {
        var _page = this.page = pageInstance || page;
        var window = _page._window;
        var hashbang = _page._hashbang;

        var pageBase = _page._getBase();
        if ('/' === path[0] && 0 !== path.indexOf(pageBase)) path = pageBase + (hashbang ? '#!' : '') + path;
        var i = path.indexOf('?');

        this.canonicalPath = path;
        var re = new RegExp('^' + escapeRegExp(pageBase));
        this.path = path.replace(re, '') || '/';
        if (hashbang) this.path = this.path.replace('#!', '') || '/';

        this.title = (hasDocument && window.document.title);
        this.state = state || {};
        this.state.path = path;
        this.querystring = ~i ? _page._decodeURLEncodedURIComponent(path.slice(i + 1)) : '';
        this.pathname = _page._decodeURLEncodedURIComponent(~i ? path.slice(0, i) : path);
        this.params = {};

        // fragment
        this.hash = '';
        if (!hashbang) {
          if (!~this.path.indexOf('#')) return;
          var parts = this.path.split('#');
          this.path = this.pathname = parts[0];
          this.hash = _page._decodeURLEncodedURIComponent(parts[1]) || '';
          this.querystring = this.querystring.split('#')[0];
        }
      }

      /**
       * Push state.
       *
       * @api private
       */

      Context.prototype.pushState = function() {
        var page = this.page;
        var window = page._window;
        var hashbang = page._hashbang;

        page.len++;
        if (hasHistory) {
            window.history.pushState(this.state, this.title,
              hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
        }
      };

      /**
       * Save the context state.
       *
       * @api public
       */

      Context.prototype.save = function() {
        var page = this.page;
        if (hasHistory) {
            page._window.history.replaceState(this.state, this.title,
              page._hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
        }
      };

      /**
       * Initialize `Route` with the given HTTP `path`,
       * and an array of `callbacks` and `options`.
       *
       * Options:
       *
       *   - `sensitive`    enable case-sensitive routes
       *   - `strict`       enable strict matching for trailing slashes
       *
       * @constructor
       * @param {string} path
       * @param {Object=} options
       * @api private
       */

      function Route(path, options, page) {
        var _page = this.page = page || globalPage;
        var opts = options || {};
        opts.strict = opts.strict || _page._strict;
        this.path = (path === '*') ? '(.*)' : path;
        this.method = 'GET';
        this.regexp = pathToRegexp_1(this.path, this.keys = [], opts);
      }

      /**
       * Return route middleware with
       * the given callback `fn()`.
       *
       * @param {Function} fn
       * @return {Function}
       * @api public
       */

      Route.prototype.middleware = function(fn) {
        var self = this;
        return function(ctx, next) {
          if (self.match(ctx.path, ctx.params)) {
            ctx.routePath = self.path;
            return fn(ctx, next);
          }
          next();
        };
      };

      /**
       * Check if this route matches `path`, if so
       * populate `params`.
       *
       * @param {string} path
       * @param {Object} params
       * @return {boolean}
       * @api private
       */

      Route.prototype.match = function(path, params) {
        var keys = this.keys,
          qsIndex = path.indexOf('?'),
          pathname = ~qsIndex ? path.slice(0, qsIndex) : path,
          m = this.regexp.exec(decodeURIComponent(pathname));

        if (!m) return false;

        delete params[0];

        for (var i = 1, len = m.length; i < len; ++i) {
          var key = keys[i - 1];
          var val = this.page._decodeURLEncodedURIComponent(m[i]);
          if (val !== undefined || !(hasOwnProperty.call(params, key.name))) {
            params[key.name] = val;
          }
        }

        return true;
      };


      /**
       * Module exports.
       */

      var globalPage = createPage();
      var page_js = globalPage;
      var default_1 = globalPage;

    page_js.default = default_1;

    return page_js;

    })));
    });

    /* src/Components/Header.svelte generated by Svelte v3.48.0 */

    // (25:6) <NavLink style="color: #f8f8f2;" href="/">
    function create_default_slot_14(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Matrix.me");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_14.name,
    		type: "slot",
    		source: "(25:6) <NavLink style=\\\"color: #f8f8f2;\\\" href=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    // (24:4) <Nav class="ms-auto">
    function create_default_slot_13(ctx) {
    	let navlink;
    	let current;

    	navlink = new NavLink({
    			props: {
    				style: "color: #f8f8f2;",
    				href: "/",
    				$$slots: { default: [create_default_slot_14] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(navlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navlink_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				navlink_changes.$$scope = { dirty, ctx };
    			}

    			navlink.$set(navlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_13.name,
    		type: "slot",
    		source: "(24:4) <Nav class=\\\"ms-auto\\\">",
    		ctx
    	});

    	return block;
    }

    // (31:10) <NavLink href="/">
    function create_default_slot_12(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Home");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_12.name,
    		type: "slot",
    		source: "(31:10) <NavLink href=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    // (30:8) <NavItem>
    function create_default_slot_11(ctx) {
    	let navlink;
    	let current;

    	navlink = new NavLink({
    			props: {
    				href: "/",
    				$$slots: { default: [create_default_slot_12] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(navlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navlink_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				navlink_changes.$$scope = { dirty, ctx };
    			}

    			navlink.$set(navlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11.name,
    		type: "slot",
    		source: "(30:8) <NavItem>",
    		ctx
    	});

    	return block;
    }

    // (34:10) <NavLink href="/spaces">
    function create_default_slot_10(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Spaces");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10.name,
    		type: "slot",
    		source: "(34:10) <NavLink href=\\\"/spaces\\\">",
    		ctx
    	});

    	return block;
    }

    // (33:8) <NavItem>
    function create_default_slot_9(ctx) {
    	let navlink;
    	let current;

    	navlink = new NavLink({
    			props: {
    				href: "/spaces",
    				$$slots: { default: [create_default_slot_10] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(navlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navlink_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				navlink_changes.$$scope = { dirty, ctx };
    			}

    			navlink.$set(navlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(33:8) <NavItem>",
    		ctx
    	});

    	return block;
    }

    // (37:10) <NavLink href="/about">
    function create_default_slot_8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("About");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(37:10) <NavLink href=\\\"/about\\\">",
    		ctx
    	});

    	return block;
    }

    // (36:8) <NavItem>
    function create_default_slot_7(ctx) {
    	let navlink;
    	let current;

    	navlink = new NavLink({
    			props: {
    				href: "/about",
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(navlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navlink_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				navlink_changes.$$scope = { dirty, ctx };
    			}

    			navlink.$set(navlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(36:8) <NavItem>",
    		ctx
    	});

    	return block;
    }

    // (40:10) <DropdownToggle nav caret>
    function create_default_slot_6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Account");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(40:10) <DropdownToggle nav caret>",
    		ctx
    	});

    	return block;
    }

    // (42:12) <DropdownItem>
    function create_default_slot_5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Log in");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(42:12) <DropdownItem>",
    		ctx
    	});

    	return block;
    }

    // (41:10) <DropdownMenu end>
    function create_default_slot_4(ctx) {
    	let dropdownitem;
    	let current;

    	dropdownitem = new DropdownItem({
    			props: {
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(dropdownitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropdownitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdownitem_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				dropdownitem_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem.$set(dropdownitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdownitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdownitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dropdownitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(41:10) <DropdownMenu end>",
    		ctx
    	});

    	return block;
    }

    // (39:8) <Dropdown nav inNavbar>
    function create_default_slot_3(ctx) {
    	let dropdowntoggle;
    	let t;
    	let dropdownmenu;
    	let current;

    	dropdowntoggle = new DropdownToggle({
    			props: {
    				nav: true,
    				caret: true,
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownmenu = new DropdownMenu({
    			props: {
    				end: true,
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(dropdowntoggle.$$.fragment);
    			t = space();
    			create_component(dropdownmenu.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropdowntoggle, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(dropdownmenu, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdowntoggle_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				dropdowntoggle_changes.$$scope = { dirty, ctx };
    			}

    			dropdowntoggle.$set(dropdowntoggle_changes);
    			const dropdownmenu_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				dropdownmenu_changes.$$scope = { dirty, ctx };
    			}

    			dropdownmenu.$set(dropdownmenu_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdowntoggle.$$.fragment, local);
    			transition_in(dropdownmenu.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdowntoggle.$$.fragment, local);
    			transition_out(dropdownmenu.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dropdowntoggle, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(dropdownmenu, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(39:8) <Dropdown nav inNavbar>",
    		ctx
    	});

    	return block;
    }

    // (29:6) <Nav class="ms-auto" navbar>
    function create_default_slot_2$1(ctx) {
    	let navitem0;
    	let t0;
    	let navitem1;
    	let t1;
    	let navitem2;
    	let t2;
    	let dropdown;
    	let current;

    	navitem0 = new NavItem({
    			props: {
    				$$slots: { default: [create_default_slot_11] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	navitem1 = new NavItem({
    			props: {
    				$$slots: { default: [create_default_slot_9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	navitem2 = new NavItem({
    			props: {
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdown = new Dropdown({
    			props: {
    				nav: true,
    				inNavbar: true,
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(navitem0.$$.fragment);
    			t0 = space();
    			create_component(navitem1.$$.fragment);
    			t1 = space();
    			create_component(navitem2.$$.fragment);
    			t2 = space();
    			create_component(dropdown.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navitem0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(navitem1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(navitem2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(dropdown, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navitem0_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				navitem0_changes.$$scope = { dirty, ctx };
    			}

    			navitem0.$set(navitem0_changes);
    			const navitem1_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				navitem1_changes.$$scope = { dirty, ctx };
    			}

    			navitem1.$set(navitem1_changes);
    			const navitem2_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				navitem2_changes.$$scope = { dirty, ctx };
    			}

    			navitem2.$set(navitem2_changes);
    			const dropdown_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				dropdown_changes.$$scope = { dirty, ctx };
    			}

    			dropdown.$set(dropdown_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navitem0.$$.fragment, local);
    			transition_in(navitem1.$$.fragment, local);
    			transition_in(navitem2.$$.fragment, local);
    			transition_in(dropdown.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navitem0.$$.fragment, local);
    			transition_out(navitem1.$$.fragment, local);
    			transition_out(navitem2.$$.fragment, local);
    			transition_out(dropdown.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navitem0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(navitem1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(navitem2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(dropdown, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(29:6) <Nav class=\\\"ms-auto\\\" navbar>",
    		ctx
    	});

    	return block;
    }

    // (28:4) <Collapse {isOpen} navbar expand="md" on:update={handleUpdate}>
    function create_default_slot_1$1(ctx) {
    	let nav;
    	let current;

    	nav = new Nav({
    			props: {
    				class: "ms-auto",
    				navbar: true,
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(nav.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(nav, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const nav_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				nav_changes.$$scope = { dirty, ctx };
    			}

    			nav.$set(nav_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nav.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nav.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(nav, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(28:4) <Collapse {isOpen} navbar expand=\\\"md\\\" on:update={handleUpdate}>",
    		ctx
    	});

    	return block;
    }

    // (23:2) <Navbar style="font-family: 'Koulen', cursive; font-size: 22px" class="header" dark expand="md">
    function create_default_slot$1(ctx) {
    	let nav;
    	let t0;
    	let navbartoggler;
    	let t1;
    	let collapse;
    	let current;

    	nav = new Nav({
    			props: {
    				class: "ms-auto",
    				$$slots: { default: [create_default_slot_13] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	navbartoggler = new NavbarToggler({ $$inline: true });
    	navbartoggler.$on("click", /*click_handler*/ ctx[2]);

    	collapse = new Collapse({
    			props: {
    				isOpen: /*isOpen*/ ctx[0],
    				navbar: true,
    				expand: "md",
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	collapse.$on("update", /*handleUpdate*/ ctx[1]);

    	const block = {
    		c: function create() {
    			create_component(nav.$$.fragment);
    			t0 = space();
    			create_component(navbartoggler.$$.fragment);
    			t1 = space();
    			create_component(collapse.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(nav, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(navbartoggler, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(collapse, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const nav_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				nav_changes.$$scope = { dirty, ctx };
    			}

    			nav.$set(nav_changes);
    			const collapse_changes = {};
    			if (dirty & /*isOpen*/ 1) collapse_changes.isOpen = /*isOpen*/ ctx[0];

    			if (dirty & /*$$scope*/ 8) {
    				collapse_changes.$$scope = { dirty, ctx };
    			}

    			collapse.$set(collapse_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nav.$$.fragment, local);
    			transition_in(navbartoggler.$$.fragment, local);
    			transition_in(collapse.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nav.$$.fragment, local);
    			transition_out(navbartoggler.$$.fragment, local);
    			transition_out(collapse.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(nav, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(navbartoggler, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(collapse, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(23:2) <Navbar style=\\\"font-family: 'Koulen', cursive; font-size: 22px\\\" class=\\\"header\\\" dark expand=\\\"md\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let navbar;
    	let current;

    	navbar = new Navbar({
    			props: {
    				style: "font-family: 'Koulen', cursive; font-size: 22px",
    				class: "header",
    				dark: true,
    				expand: "md",
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(navbar.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(navbar, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const navbar_changes = {};

    			if (dirty & /*$$scope, isOpen*/ 9) {
    				navbar_changes.$$scope = { dirty, ctx };
    			}

    			navbar.$set(navbar_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navbar, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	let isOpen = false;

    	function handleUpdate(event) {
    		$$invalidate(0, isOpen = event.detail.isOpen);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(0, isOpen = !isOpen);

    	$$self.$capture_state = () => ({
    		Collapse,
    		Navbar,
    		NavbarToggler,
    		NavbarBrand,
    		Nav,
    		NavItem,
    		NavLink,
    		Dropdown,
    		DropdownToggle,
    		DropdownMenu,
    		DropdownItem,
    		isOpen,
    		handleUpdate
    	});

    	$$self.$inject_state = $$props => {
    		if ('isOpen' in $$props) $$invalidate(0, isOpen = $$props.isOpen);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [isOpen, handleUpdate, click_handler];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/Pages/About.svelte generated by Svelte v3.48.0 */

    function create_fragment$4(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('About', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<About> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class About extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "About",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/Components/Search.svelte generated by Svelte v3.48.0 */
    const file$2 = "src/Components/Search.svelte";

    function create_fragment$3(ctx) {
    	let div;
    	let input;

    	const block = {
    		c: function create() {
    			div = element("div");
    			input = element("input");
    			attr_dev(input, "placeholder", "Foss space...");
    			attr_dev(input, "class", "space-input svelte-1c4skh3");
    			attr_dev(input, "type", "text");
    			add_location(input, file$2, 5, 4, 89);
    			attr_dev(div, "class", "container svelte-1c4skh3");
    			add_location(div, file$2, 4, 0, 61);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Search', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Search> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Input });
    	return [];
    }

    class Search extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Search",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/Pages/Spaces.svelte generated by Svelte v3.48.0 */

    function create_fragment$2(ctx) {
    	let search;
    	let current;
    	search = new Search({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(search.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(search, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(search.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(search.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(search, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Spaces', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Spaces> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Search });
    	return [];
    }

    class Spaces extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Spaces",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/Pages/Home.svelte generated by Svelte v3.48.0 */
    const file$1 = "src/Pages/Home.svelte";

    // (29:8) <Col xs="6">
    function create_default_slot_2(ctx) {
    	let div;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			attr_dev(img, "class", "photo svelte-ug67v6");
    			if (!src_url_equal(img.src, img_src_value = "images/space-screen.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "spaces-in-element");
    			add_location(img, file$1, 30, 16, 1024);
    			attr_dev(div, "class", "spaces svelte-ug67v6");
    			add_location(div, file$1, 29, 12, 987);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(29:8) <Col xs=\\\"6\\\">",
    		ctx
    	});

    	return block;
    }

    // (38:8) <Col xs="6" class="vertical-text">
    function create_default_slot_1(ctx) {
    	let h2;
    	let t1;
    	let div;
    	let p;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Matrix Spaces";
    			t1 = space();
    			div = element("div");
    			p = element("p");
    			p.textContent = "Spaces are concept simmilar to Discord servers. It's a\n                    collection of rooms tied toghether as Space. You can create\n                    your own Spaces or join existing one. Unlike Discord, Matrix\n                    respects your privacy - rooms can be encrypted, as well as\n                    your direct messages.";
    			set_style(h2, "position", "absolute");
    			add_location(h2, file$1, 38, 12, 1265);
    			set_style(p, "margin", "auto");
    			add_location(p, file$1, 40, 16, 1363);
    			attr_dev(div, "class", "spaces svelte-ug67v6");
    			add_location(div, file$1, 39, 12, 1326);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(38:8) <Col xs=\\\"6\\\" class=\\\"vertical-text\\\">",
    		ctx
    	});

    	return block;
    }

    // (28:4) <Row>
    function create_default_slot(ctx) {
    	let col0;
    	let t;
    	let col1;
    	let current;

    	col0 = new Col({
    			props: {
    				xs: "6",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	col1 = new Col({
    			props: {
    				xs: "6",
    				class: "vertical-text",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col0.$$.fragment);
    			t = space();
    			create_component(col1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(col1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col0_changes.$$scope = { dirty, ctx };
    			}

    			col0.$set(col0_changes);
    			const col1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col1_changes.$$scope = { dirty, ctx };
    			}

    			col1.$set(col1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col0.$$.fragment, local);
    			transition_in(col1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col0.$$.fragment, local);
    			transition_out(col1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(col1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(28:4) <Row>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div1;
    	let h1;
    	let t1;
    	let p;
    	let t3;
    	let div0;
    	let iframe;
    	let iframe_src_value;
    	let t4;
    	let div2;
    	let row;
    	let t5;
    	let spaces;
    	let current;

    	row = new Row({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	spaces = new Spaces({ $$inline: true });

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h1 = element("h1");
    			h1.textContent = "What is Matrix?";
    			t1 = space();
    			p = element("p");
    			p.textContent = "\"Matrix is an open source project that publishes the Matrix open\n        standard for secure, decentralised, real-time communication, and its\n        Apache licensed reference implementations.\" ~ Matrix.org";
    			t3 = space();
    			div0 = element("div");
    			iframe = element("iframe");
    			t4 = space();
    			div2 = element("div");
    			create_component(row.$$.fragment);
    			t5 = space();
    			create_component(spaces.$$.fragment);
    			attr_dev(h1, "class", "title");
    			add_location(h1, file$1, 6, 4, 131);
    			attr_dev(p, "class", "title");
    			add_location(p, file$1, 7, 4, 174);
    			attr_dev(iframe, "title", "Intro Video by. DenshiVideo");
    			attr_dev(iframe, "id", "odysee-iframe");
    			attr_dev(iframe, "width", "560");
    			attr_dev(iframe, "height", "315");
    			if (!src_url_equal(iframe.src, iframe_src_value = "https://odysee.com/$/embed/just-use-matrix./4155d8d8c49addd0ad0790295ee70363cf1e4f98?r=BMDJh1LPjdxukf2yaYSsH71azMkXJefp")) attr_dev(iframe, "src", iframe_src_value);
    			iframe.allowFullscreen = true;
    			add_location(iframe, file$1, 15, 8, 588);
    			set_style(div0, "webkit-border-radius", "25px");
    			set_style(div0, "-moz-border-radius", "25px");
    			set_style(div0, "border-radius", "25px");
    			set_style(div0, "width", "560px");
    			set_style(div0, "margin", "0 auto");
    			set_style(div0, "overflow", "hidden");
    			set_style(div0, "margin-top", "40px");
    			add_location(div0, file$1, 12, 4, 420);
    			attr_dev(div1, "class", "container svelte-ug67v6");
    			add_location(div1, file$1, 5, 0, 103);
    			attr_dev(div2, "class", "container svelte-ug67v6");
    			add_location(div2, file$1, 26, 0, 920);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h1);
    			append_dev(div1, t1);
    			append_dev(div1, p);
    			append_dev(div1, t3);
    			append_dev(div1, div0);
    			append_dev(div0, iframe);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div2, anchor);
    			mount_component(row, div2, null);
    			insert_dev(target, t5, anchor);
    			mount_component(spaces, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const row_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			transition_in(spaces.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row.$$.fragment, local);
    			transition_out(spaces.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div2);
    			destroy_component(row);
    			if (detaching) detach_dev(t5);
    			destroy_component(spaces, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Spaces, Col, Row });
    	return [];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.48.0 */
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let header;
    	let t;
    	let switch_instance;
    	let current;
    	header = new Header({ $$inline: true });
    	var switch_value = /*current*/ ctx[0];

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(header.$$.fragment);
    			t = space();
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			add_location(main, file, 28, 0, 801);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(header, main, null);
    			append_dev(main, t);

    			if (switch_instance) {
    				mount_component(switch_instance, main, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (switch_value !== (switch_value = /*current*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, main, null);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(header);
    			if (switch_instance) destroy_component(switch_instance);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let current = Home;
    	page('/', () => $$invalidate(0, current = Home));
    	page('/about', () => $$invalidate(0, current = About));
    	page('/spaces', () => $$invalidate(0, current = Spaces));
    	page.start();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Button,
    		page,
    		Header,
    		About,
    		Home,
    		Spaces,
    		current
    	});

    	$$self.$inject_state = $$props => {
    		if ('current' in $$props) $$invalidate(0, current = $$props.current);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [current];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
