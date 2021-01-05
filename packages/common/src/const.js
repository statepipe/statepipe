export const STATEPIPE_ATTR = ':statepipe';
export const STATE_ATTR = ':state';
export const PIPE_ATTR = ':pipe';
export const TRIGGER_ATTR = ':trigger';
export const OUT_ATTR = ':out';
export const PAYLOAD_ATTR = ':payload';
export const ACTION_ATTR = ':action';

export const OUT_STORE = 'out';
export const PIPE_STORE = 'pipe';
export const TRIGGER_STORE = 'trigger';

export const QUERY_COMPONENTS = `[\\${TRIGGER_ATTR}],[\\${PIPE_ATTR}],[\\${OUT_ATTR}]`;
export const QUERY_STATEPIPE = `[\\${STATEPIPE_ATTR}]`;
export const COMPONENT_ATTR_LIST = [OUT_ATTR, PIPE_ATTR, TRIGGER_ATTR];

export const SCHEMA_INDEX = 'index';
export const SCHEMA_STORE = 'store';
export const SCHEMA_SLUG = 'slug';
export const SCHEMA_ACTION = 'action';
export const SCHEMA_EVENT = 'event';
export const SCHEMA_FN = 'fn';
export const SCHEMA_ARGS = 'args';

export const TRIGGER_PROPS = [
  SCHEMA_INDEX,
  SCHEMA_STORE,
  SCHEMA_SLUG,
  SCHEMA_FN,
  SCHEMA_ARGS,
  SCHEMA_ACTION,
  SCHEMA_EVENT,
];

export const PIPE_PROPS = [
  SCHEMA_INDEX,
  SCHEMA_STORE,
  SCHEMA_SLUG,
  SCHEMA_FN,
  SCHEMA_ARGS,
];

export const OUT_PROPS = [
  SCHEMA_INDEX,
  SCHEMA_STORE,
  SCHEMA_SLUG,
  SCHEMA_FN,
  SCHEMA_ARGS,
];

export const ALIAS_STORES = {
  [PIPE_ATTR]: PIPE_STORE,
  [OUT_ATTR]: OUT_STORE,
  [TRIGGER_ATTR]: TRIGGER_STORE,
};

export const ALIAS_ATTR = {
  [PIPE_STORE]: PIPE_ATTR,
  [OUT_STORE]: OUT_ATTR,
  [TRIGGER_STORE]: TRIGGER_ATTR,
};
