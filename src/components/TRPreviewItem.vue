<template>
  <div class="tr-preview-item">
    <div
      class="page tr-preview-item__box"
      :class="component.name.toLowerCase().indexOf('material') !== -1 && 'page--material'"
    >
      <div
        style="width: 100%;"
        v-html="component.markup"
        ontouchstart=" "
      />

      <div class="tr-preview-item__links">
        <a
          v-for="(icon, framework) in icons.frameworks"
          :key="framework"
          :data-tooltip="tooltip[framework]"
          :href="getLink(framework)"
          target="_blank"
        >
          <i
            :style="{ background: `url(${icon})` }"
          />
        </a>
      </div>
    </div>

    <div class="tr-preview-item__title">
      {{ component.name }}
      <i
        :style="{
          background: `url(${
            icons.platforms[/material/i.test(component.name) ? 'android' : 'apple']
          })`
        }"
      />
    </div>
  </div>

</template>

<script>
import util from '@/util';
import appleIcon from '@/assets/logos/apple.svg';
import androidIcon from '@/assets/logos/android.svg';
import jsIcon from '@/assets/logos/js.svg';
import vueIcon from '@/assets/logos/vue.svg';
import reactIcon from '@/assets/logos/react.svg';
import angular1Icon from '@/assets/logos/angular1.svg';
import angular2Icon from '@/assets/logos/angular2.svg';
import cssIcon from '@/assets/logos/css.svg';

export default {
  name: 'TRPreviewItem',
  props: {
    component: {
      type: Object,
      default() {
        return {};
      },
    },
  },

  data() {
    return {
      icons: {
        platforms: {
          apple: appleIcon,
          android: androidIcon,
        },
        frameworks: {
          js: jsIcon,
          vue: vueIcon,
          react: reactIcon,
          angular1: angular1Icon,
          angular2: angular2Icon,
          css: cssIcon,
        },
      },
      tooltip: {
        js: 'Web Components',
        vue: 'Vue.js',
        react: 'React',
        angular1: 'AngularJS',
        angular2: 'Angular 2+',
        css: 'HTML + CSS',
      },
    };
  },

  methods: {
    getLink(framework) {
      const prefix = 'https://onsen.io/v2/api';
      const link = el => `${prefix}/${framework}/${el}.html`;
      const { category } = this.component;

      if (framework === 'css') {
        return `${prefix}/css.html#${util.toId(category)}-category`;
      }

      let element;

      if (['textarea', 'notification'].indexOf(category.toLowerCase()) === -1
        && this.component.name !== 'Button Bar') {
        let fixedName;
        switch (category.toLowerCase()) {
          case 'radio button':
            fixedName = 'radio';
            break;
          case 'select input':
            fixedName = 'select';
            break;
          case 'text input':
            fixedName = 'input';
            break;
          default:
            fixedName = category;
        }

        const name = `${util.toId(fixedName)}`;

        switch (framework) {
          case 'react':
            element = util.capitalizeAll(util.toLabel(name)).replace(/\s+/, '');
            break;
          case 'vue':
            element = `v-ons-${name}`;
            break;
          default:
            element = `ons-${name}`;
        }
      }

      return element ? link(element) : '#';
    },
  },
};
</script>

<style scoped>
.tr-preview-item {
  display: block;
  width: 280px;
  box-sizing: border-box;
  margin: 0px 16px 26px;

  @media (--smallscreen) {
    width: auto;
    margin-right: 0px;
    margin-left: 0px;
  }
}

.tr-preview-item__title {
  color: #999;
  font-size: 14px;
  color: #444;
  font-weight: 500;
  line-height: 1.4;
  text-decoration: none;
  margin: 14px 0 4px 0;
  display: inline-block;
  padding: 0 10px;
  display: block;

  & i {
    float: right;
    width: 21px;
    height: 17px;
  }
}

.tr-preview-item__box {
  height: 201px;
  text-align: center;
  position: relative;
  z-index: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-radius: 3px;
  width: 280px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08);
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  box-shadow: 0 1px 3px 1px rgba(0, 0, 0, 0.18);


  @media (--smallscreen) {
    width: auto;
    border-radius: 0;
    margin-right: -10px;
    margin-left: -10px;
    box-shadow: none;
  }


  & .tr-preview-item__links {
    opacity: 0;
    transition: opacity .2s ease;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, .2);
    z-index: 2147483647; /* Maximum */
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    background-color: #fff;
    height: 30px;

    & a[href="#"] {
      display: none;
    }

    & i {
      margin: 0 6px;
      display: block;
      width: 26px;
      height: 20px;
      opacity: .8;

      &:hover {
        opacity: 1;
      }
    }
  }

  &:hover .tr-preview-item__links {
    opacity: 1;
  }
}
</style>
