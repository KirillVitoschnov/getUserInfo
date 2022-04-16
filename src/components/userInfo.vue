<template>
  <div class="user-info">
    <ul>
      <li> Высота экрана - {{ UserHeight.screenHeight }}</li>
      <li> Ширина экрана - {{ UserWidth.screenWidth }}</li>
      <li> Доступная Высота экрана - {{ UserHeight.availableHeight }}</li>
      <li> Доступная Ширина экрана - {{ UserWidth.availableWidth }}</li>
      <li> Высота внешнего окна - {{ UserHeight.outerHeight }}</li>
      <li> Ширина внешнего окна - {{ UserWidth.outerWidth }}</li>
      <li> Высота внутреннего размер окна - {{ UserHeight.InnerHeight }}</li>
      <li> Ширина внутреннего размер окна - {{ UserWidth.InnerWidth }}</li>
      <li> Высота веб-страницы - {{ UserHeight.ClientHeight }}</li>
      <li> Ширина веб-страницы - {{ UserWidth.ClientWidth }}</li>
    </ul>
    <ul>
      <li>Платформа- {{ UserAgentInfo.platform }}</li>
      <li>Операционная система-{{ UserAgentInfo.Os }}</li>
      <li>Браузер- {{ UserAgentInfo.BrowserName }}</li>
      <li>Колличество Ядер/Потоков процессора - {{ UserAgentInfo.hardwareConcurrency }}</li>
      <li>Видеокарта - {{ UserAgentInfo.video }}</li>
    </ul>
    <ul>
      <li>
        Ваша текущая Широта - {{ UserAgentPosition.latitude }}
      </li>
      <li>
        Ваша текущая долгота - {{ UserAgentPosition.longitude }}
      </li>
      <li>Радиус обнаружения - {{ UserAgentPosition.accuracy }} метров</li>
    </ul>

    <ul>
      <li>Текущий заряд батареи - {{ Battery.level }}</li>
      <li>Cтатус заряда батареи - {{ Battery.status }}</li>
      <li>Батарея будет заряжена в течении - {{ Battery.fullCharge }} секунд</li>
      <li>Батарея будет разряжена в течении - {{ Battery.drain }} секунд</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'userInfo',
  data: function () {
    return {
      Battery: {
        fullCharge: '',
        drain: '',
        level: '',
        status: ''
      },
      UserAgentPosition: {
        latitude: '',
        longitude: '',
        accuracy: ''
      },
      UserAgentInfo: {
        Os: '',
        platform: 'Компьютер',
        BrowserName: '',
        hardwareConcurrency: '',
        video: ''
      },
      UserWidth: {
        InnerWidth: '',
        ClientWidth: '',
        screenWidth: '',
        availableWidth: '',
        outerWidth: ''
      },
      UserHeight: {
        InnerHeight: '',
        ClientHeight: '',
        screenHeight: '',
        availableHeight: '',
        outerHeight: ''
      }
    }
  },
  methods: {
    getBatteryInfo (battery) {
      this.Battery.level = battery.level * 100 + '%'
      if (battery.charging) {
        this.Battery.status = 'Батарея заряжается'
      } else {
        this.Battery.status = 'Батарея разряжается'
      }
      this.Battery.drain = battery.dischargingTime
      this.Battery.fullCharge = battery.chargingTime

    },
    success (pos) {
      var crd = pos.coords
      this.UserAgentPosition.latitude = crd.latitude
      this.UserAgentPosition.longitude = crd.longitude
      this.UserAgentPosition.accuracy = crd.accuracy
    }
  },
  mounted: function () {
    var userDeviceArray = [
      {device: 'Android', platform: /Android/},
      {device: 'iPhone', platform: /iPhone/},
      {device: 'iPad', platform: /iPad/},
      {device: 'Symbian', platform: /Symbian/},
      {device: 'Windows Phone', platform: /Windows Phone/},
      {device: 'Tablet OS', platform: /Tablet OS/},
      {device: 'Linux', platform: /Linux/},
      {device: 'Windows', platform: /Windows NT/},
      {device: 'Macintosh', platform: /Macintosh/}
    ]

    var platform = navigator.userAgent

    function getPlatform () {
      for (var i in userDeviceArray) {
        if (userDeviceArray[i].platform.test(platform)) {
          return userDeviceArray[i].device
        }
      }
      return 'Неизвестная cистема!' + platform
    }

    this.UserAgentInfo.Os = getPlatform()
    let gl = document.createElement('canvas').getContext('webgl'),
      ext = gl.getExtension('WEBGL_debug_renderer_info')
    this.UserAgentInfo.video = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)
    this.UserAgentInfo.hardwareConcurrency = navigator.hardwareConcurrency
    const getBatteryInfo = this.getBatteryInfo.bind(this)
    navigator.getBattery().then(function (battery) {
      getBatteryInfo(battery)
    })

    let browserVersion
    browserVersion = (userAgent, regex) => {
      return userAgent.match(regex) ? userAgent.match(regex)[2] : null
    }

    function getBrowser () {
      const userAgent = navigator.userAgent
      let browser = 'unkown'
      browser = /ucbrowser/i.test(userAgent) ? 'UCBrowser' : browser
      browser = /edg/i.test(userAgent) ? 'Edge' : browser
      browser = /googlebot/i.test(userAgent) ? 'GoogleBot' : browser
      browser = /chromium/i.test(userAgent) ? 'Chromium' : browser
      browser =
        /firefox|fxios/i.test(userAgent) && !/seamonkey/i.test(userAgent)
          ? 'Firefox'
          : browser
      browser =
        /; msie|trident/i.test(userAgent) && !/ucbrowser/i.test(userAgent)
          ? 'IE'
          : browser
      browser =
        /chrome|crios/i.test(userAgent) &&
        !/opr|opera|chromium|edg|ucbrowser|googlebot/i.test(userAgent)
          ? 'Chrome'
          : browser
      browser =
        /safari/i.test(userAgent) &&
        !/chromium|edg|ucbrowser|chrome|crios|opr|opera|fxios|firefox/i.test(
          userAgent
        )
          ? 'Safari'
          : browser
      browser = /opr|opera/i.test(userAgent) ? 'Opera' : browser
      switch (browser) {
        case 'UCBrowser':
          return `${browser}/${browserVersion(
            userAgent,
            /(ucbrowser)\/([\d.]+)/i
          )}`
        case 'Edge':
          return `${browser}/${browserVersion(
            userAgent,
            /(edge|edga|edgios|edg)\/([\d.]+)/i
          )}`
        case 'GoogleBot':
          return `${browser}/${browserVersion(
            userAgent,
            /(googlebot)\/([\d.]+)/i
          )}`
        case 'Chromium':
          return `${browser}/${browserVersion(
            userAgent,
            /(chromium)\/([\d.]+)/i
          )}`
        case 'Firefox':
          return `${browser}/${browserVersion(
            userAgent,
            /(firefox|fxios)\/([\d.]+)/i
          )}`
        case 'Chrome':
          return `${browser}/${browserVersion(
            userAgent,
            /(chrome|crios)\/([\d.]+)/i
          )}`
        case 'Safari':
          return `${browser}/${browserVersion(
            userAgent,
            /(safari)\/([\d.]+)/i
          )}`
        case 'Opera':
          return `${browser}/${browserVersion(
            userAgent,
            /(opera|opr)\/([\d.]+)/i
          )}`
        case 'IE':
          const version = browserVersion(userAgent, /(trident)\/([\d.]+)/i)
          return version
            ? `${browser}/${parseFloat(version) + 4.0}`
            : `${browser}/7.0`
        default:
          return `unknown/0.0.0.0`
      }
    }

    this.UserAgentInfo.BrowserName = getBrowser()
    const isMobile = navigator.userAgent.toLowerCase().match(/mobile/i)
    if (isMobile) {
      this.UserAgentInfo.platform = 'Телефон'
    }
    const isTablet = navigator.userAgent.toLowerCase().match(/tablet/i)
    if (isTablet) {
      this.UserAgentInfo.platform = 'Планшет'
    }
    const isAndroid = navigator.userAgent.toLowerCase().match(/android/i)
    if (isAndroid) {
      this.UserAgentInfo.platform = 'Телефон на андроиде'
    }
    const isiPhone = navigator.userAgent.toLowerCase().match(/iphone/i)
    if (isiPhone) {
      this.UserAgentInfo.platform = 'Айфон'
    }
    const isiPad = navigator.userAgent.toLowerCase().match(/ipad/i)
    if (isiPad) {
      this.UserAgentInfo.platform = 'Айпад'
    }
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }

    function error (err) {
      console.warn(`ERROR(${err.code}): ${err.message}`)
    }

    navigator.geolocation.getCurrentPosition(this.success, error, options)

    this.UserWidth.screenWidth = window.screen.width
    this.UserHeight.screenHeight = window.screen.height
    this.UserWidth.availableWidth = window.screen.availWidth
    this.UserHeight.availableHeight = window.screen.availHeight
    this.UserWidth.outerWidth = window.outerWidth
    this.UserHeight.outerHeight = window.outerHeight
    this.UserWidth.InnerWidth = window.innerWidth
    this.UserHeight.InnerHeight = window.innerHeight
    this.UserWidth.ClientWidth = document.documentElement.clientWidth
    this.UserHeight.ClientHeight = document.documentElement.clientHeight
  }
}
</script>

<style scoped>

</style>
