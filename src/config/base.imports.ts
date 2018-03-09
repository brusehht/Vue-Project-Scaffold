import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import utils from '@/utils/index';
import base from '@/api/base';
import common from '@/api/common';
import ws from '@/api/ws/index';
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';

export { utils as Utils };
export { base as BaseAPI };
export { common as CommonAPI };
export { ws as Socket };
export { Component, Prop, Vue, Watch };
export { mapState, mapGetters, mapMutations, mapActions };
