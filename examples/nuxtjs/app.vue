<template>
  <div>
    <div style="width:100%; max-width:500px; padding: 0 10px;">
      <skip-widget @ready="onWidgetReady" id="skip-widget"></skip-widget>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

function waitForElement(selector, callback, options = {}) {
  const { timeout = 5000, interval = 50 } = options
  const start = Date.now()

  const check = () => {
    const el = document.querySelector(selector)
    if (el) {
      callback(el)
    } else if (Date.now() - start < timeout) {
      setTimeout(check, interval)
    } else {
      console.warn(`waitForElement: Timed out waiting for ${selector}`)
    }
  }

  check()
}

onMounted(() => {
  waitForElement('#skip-widget', (widget) => {
    console.log("widget found");
    console.log(widget);

    widget.addEventListener('ready', () => {
      // Assign callback functions after the component is ready
      widget.onRouteUpdated = (props) => {
        console.log('Route updated:', props)
      }

      widget.onTxSuccess = (tx) => {
        console.log('Transaction successful:', tx)
      }

      widget.onTxError = (error) => {
        console.error('Transaction error:', error)
      }
    })
    // widget.theme = {
    //   backgroundColor: '#191A1C',
    //   textColor: '#E6EAE9',
    //   borderColor: '#363B3F',
    //   brandColor: 'black',
    //   highlightColor: '#1F2022',
    // }

    // widget.defaultRoute = {
    //   srcChainID: 'osmosis-1',
    //   srcAssetDenom:
    //     'ibc/1480b8fd20ad5fcae81ea87584d269547dd4d436843c1d20f15e00eb64743ef4',
    // }
    // widget.onRouteUpdated = (props) => console.log(props);
  })
})
</script>