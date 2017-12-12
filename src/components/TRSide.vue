<template>
  <div class="tr-side">
    <div class="tr-side__tabs">
      <ul>
        <li
          v-for="(tab, $index) in tabs"
          :key="tab.label"
        >
          <label>
            <input
              type="radio"
              style="display:none"
              :value="$index"
              v-model="tabActive"
            >
            <a class="tr-side__tab">
              <span>{{ tab.label }}</span>
            </a>
          </label>
        </li>
      </ul>
    </div>

    <keep-alive>
      <component
        :is="tabs[tabActive].component"
        class="tr-side__content"
      />
    </keep-alive>
  </div>
</template>

<script>
import TRFilter from '@/components/TRFilter';
import TREditor from '@/components/TREditor';

export default {
  name: 'TRSide',
  data() {
    return {
      tabActive: 0,
      tabs: [
        {
          label: 'View',
          component: TRFilter,
        },
        {
          label: 'Editor',
          component: TREditor,
        },
      ],
    };
  },
};
</script>

<style scoped>
.tr-side {
  border-right: 1px solid var(--border-color);
}

.tr-side__tabs {
  user-select: none;
  align-items: stretch;
  display: flex;
  font-size: 1rem;
  justify-content: space-between;
  overflow: hidden;
  overflow-x: auto;
  white-space: nowrap;
}

.tr-side__tabs ul {
  align-items: center;
  border-bottom-color: var(--border-color);
  border-bottom-style: solid;
  border-bottom-width: 1px;
  display: flex;
  flex-grow: 1;
  flex-shrink: 0;
  justify-content: flex-start;
  padding-left: 20px;
}

.tr-side__tabs li {
  display: block;
}

.tr-side__tab {
  align-items: center;
  border-bottom-color: var(--border-color);
  border-bottom-style: solid;
  border-bottom-width: 1px;
  color: #4a4a4a;
  display: flex;
  justify-content: center;
  margin-bottom: -2px;
  padding: 0.5em 1em;
  vertical-align: top;
}

:checked + .tr-side__tab {
  border: 1px solid transparent;
  border-radius: 3px 3px 0 0;

  background-color: white;
  border-color: var(--border-color);
  border-bottom-color: transparent !important;
}

.tr-side__content {
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: none;
  height: calc(100% - 70px);
}
</style>
