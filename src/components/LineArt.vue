<template>
  <div>
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 1920.4 488.8"
      style="enable-background:new 0 0 1920.4 488.8;"
      xml:space="preserve"
    >
      <g id="Lines">
        <linearGradient
          id="SVGID_1_"
          gradientUnits="userSpaceOnUse"
          x1="1925.2803"
          y1="166.4192"
          x2="0.6832"
          y2="222.5419"
        >
          <stop offset="0" style="stop-color:#F2006E" />
          <stop offset="1" style="stop-color:#3194FF" />
        </linearGradient>
        <polyline
          class="st0"
          points="0.3,199.3 57.3,125.3 184.3,97.3 335.3,142.3 560.3,276.3 849.3,297.3 970.3,354.3 1099.3,318.3
		1178.3,354.3 1254.3,305.3 1369.3,263.3 1501.3,283.3 1540.3,225.3 1753.3,142.3 1856.3,28.3 1920.3,0.3 	"
        />
        <linearGradient
          id="SVGID_2_"
          gradientUnits="userSpaceOnUse"
          x1="1525.3369"
          y1="561.4759"
          x2="0.7249"
          y2="917.599"
        >
          <stop offset="0" style="stop-color:#F2006E" />
          <stop offset="1" style="stop-color:#3194FF" />
        </linearGradient>
        <polyline
          class="st1"
          points="0.3,199.3 177.3,101.3 351.3,141.3 373.3,199.3 622.3,244.3 751.3,311.3 978.3,273.3 1178.3,354.3 1270.3,269.3 1360.3,308.3 1402.3,228.3 1552.3,245.3 1576.3,203.3 1678.3,142.3 1815.3,86.3 1920.3,0.3 	"
        />
      </g>
    </svg>
  </div>
</template>

<script>
import anime from 'animejs';
export default {
  name: 'LineArt',
  mounted: function() {
    anime({
      targets: '.st0',
      points: [
        {
          value:
            '0.3,199.3 177.3,142.3 281.3,104.3 409.3,218.3 690.3,253.3 834.3,354.3 1097.3,329.3 1236.3,318.3 1293.3,322.3 1391.3,305.3 1452.3,215.3 1636.3,255.3 1677.3,225.3 1722.3,93.3 1898.3,52.3 1920.3,0.3 	'
        },
        {
          value:
            '0.3,199.3 57.3,125.3 184.3,97.3 335.3,142.3 560.3,276.3 849.3,297.3 970.3,354.3 1099.3,318.3 1178.3,354.3 1254.3,305.3 1369.3,263.3 1501.3,283.3 1540.3,225.3 1753.3,142.3 1856.3,28.3 1920.3,0.3 	'
        }
      ],
      easing: 'easeOutQuad',
      duration: 25000,
      loop: true
    });
    anime({
      targets: '.st1',
      points: [
        {
          value:
            '0.3,199.3 101.3,115.3 213.3,130.3 329.3,113.3 492.3,244.3 627.3,213.3 742.3,341.3 996.3,299.3 1114.3,354.3 1246.3,334.3 1326.3,244.3 1456.3,255.3 1545.3,177.3 1660.3,190.3 1758.3,71.3 1920.3,0.3 	'
        },
        {
          value:
            '0.3,199.3 177.3,101.3 351.3,141.3 373.3,199.3 622.3,244.3 751.3,311.3 978.3,273.3 1178.3,354.3 1270.3,269.3 1360.3,308.3 1402.3,228.3 1552.3,245.3 1576.3,203.3 1678.3,142.3 1815.3,86.3 1920.3,0.3 	'
        }
      ],
      easing: 'easeOutQuad',
      duration: 45000,
      loop: true
    });
  }
};
</script>

<style scoped>
svg {
  display: block;
  width: 100%;
  height: 100%;
}
.st0 {
  fill: none;
  stroke: url(#SVGID_1_);
  stroke-width: 1;
  stroke-miterlimit: 10;
}

.st1 {
  fill: none;
  stroke: url(#SVGID_2_);
  stroke-width: 1;
  stroke-miterlimit: 10;
}
</style>
