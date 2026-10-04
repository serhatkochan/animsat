import { Dimensions, Platform, StyleSheet, View, useWindowDimensions } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

function useCoverSize() {
  const window = useWindowDimensions();
  const screen = Dimensions.get('screen');
  const width = Math.max(window.width, screen.width);
  const height =
    Platform.OS === 'android' ? Math.max(window.height, screen.height) : window.height;
  return { width, height };
}

type BrandAtmosphereProps = {
  idPrefix?: string;
};

export function BrandAtmosphere({ idPrefix = 'brand' }: BrandAtmosphereProps) {
  const { width, height } = useCoverSize();
  const id = (name: string) => `${idPrefix}-${name}`;

  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: '#000' }]}>
      <Svg width={width} height={height}>
        <Defs>
          <RadialGradient
            id={id('violet')}
            cx={width * 0.28}
            cy={height * 0.42}
            rx={width * 0.72}
            ry={height * 0.48}
            fx={width * 0.38}
            fy={height * 0.36}
            gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="#6D28D9" stopOpacity="0.52" />
            <Stop offset="0.55" stopColor="#3B0764" stopOpacity="0.3" />
            <Stop offset="1" stopColor="#000000" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient
            id={id('red')}
            cx={width * 0.42}
            cy={height * 0.08}
            rx={width * 0.88}
            ry={height * 0.42}
            fx={width * 0.52}
            fy={height * 0.02}
            gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="#F43F5E" stopOpacity="0.68" />
            <Stop offset="0.35" stopColor="#BE123C" stopOpacity="0.46" />
            <Stop offset="0.7" stopColor="#7F1D4A" stopOpacity="0.22" />
            <Stop offset="1" stopColor="#000000" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient
            id={id('pink')}
            cx={width * 0.78}
            cy={height * 0.18}
            rx={width * 0.58}
            ry={height * 0.36}
            fx={width * 0.88}
            fy={height * 0.12}
            gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="#EC4899" stopOpacity="0.5" />
            <Stop offset="0.5" stopColor="#9D174D" stopOpacity="0.26" />
            <Stop offset="1" stopColor="#000000" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient
            id={id('blue')}
            cx={width * 0.68}
            cy={height * 0.52}
            rx={width * 0.7}
            ry={height * 0.55}
            fx={width * 0.58}
            fy={height * 0.58}
            gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="#3B82F6" stopOpacity="0.55" />
            <Stop offset="0.4" stopColor="#1D4ED8" stopOpacity="0.38" />
            <Stop offset="0.75" stopColor="#1E3A8A" stopOpacity="0.2" />
            <Stop offset="1" stopColor="#000000" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient
            id={id('wine')}
            cx={width * 0.18}
            cy={height * 0.82}
            rx={width * 0.75}
            ry={height * 0.5}
            fx={width * 0.08}
            fy={height * 0.9}
            gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="#BE123C" stopOpacity="0.5" />
            <Stop offset="0.45" stopColor="#881337" stopOpacity="0.3" />
            <Stop offset="1" stopColor="#000000" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient
            id={id('navy')}
            cx={width * 0.9}
            cy={height * 0.78}
            rx={width * 0.55}
            ry={height * 0.42}
            fx={width * 0.96}
            fy={height * 0.86}
            gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="#2563EB" stopOpacity="0.42" />
            <Stop offset="0.55" stopColor="#172554" stopOpacity="0.24" />
            <Stop offset="1" stopColor="#000000" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient
            id={id('magenta')}
            cx={width * 0.55}
            cy={height * 0.68}
            rx={width * 0.48}
            ry={height * 0.32}
            fx={width * 0.48}
            fy={height * 0.72}
            gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="#DB2777" stopOpacity="0.36" />
            <Stop offset="0.55" stopColor="#831843" stopOpacity="0.18" />
            <Stop offset="1" stopColor="#000000" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient
            id={id('hlWarm')}
            cx={width * 0.48}
            cy={height * 0.06}
            rx={width * 0.26}
            ry={height * 0.13}
            fx={width * 0.5}
            fy={height * 0.04}
            gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="#FFF5F8" stopOpacity="0.55" />
            <Stop offset="0.28" stopColor="#FBCFE8" stopOpacity="0.28" />
            <Stop offset="1" stopColor="#000000" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient
            id={id('hlCool')}
            cx={width * 0.7}
            cy={height * 0.38}
            rx={width * 0.2}
            ry={height * 0.14}
            fx={width * 0.68}
            fy={height * 0.36}
            gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="#EFF6FF" stopOpacity="0.38" />
            <Stop offset="0.35" stopColor="#93C5FD" stopOpacity="0.16" />
            <Stop offset="1" stopColor="#000000" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient
            id={id('hlViolet')}
            cx={width * 0.26}
            cy={height * 0.52}
            rx={width * 0.16}
            ry={height * 0.1}
            fx={width * 0.28}
            fy={height * 0.5}
            gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="#F3E8FF" stopOpacity="0.32" />
            <Stop offset="0.4" stopColor="#C4B5FD" stopOpacity="0.12" />
            <Stop offset="1" stopColor="#000000" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect x={0} y={0} width={width} height={height} fill="#000000" />
        <Rect x={0} y={0} width={width} height={height} fill={`url(#${id('violet')})`} />
        <Rect x={0} y={0} width={width} height={height} fill={`url(#${id('blue')})`} />
        <Rect x={0} y={0} width={width} height={height} fill={`url(#${id('red')})`} />
        <Rect x={0} y={0} width={width} height={height} fill={`url(#${id('pink')})`} />
        <Rect x={0} y={0} width={width} height={height} fill={`url(#${id('wine')})`} />
        <Rect x={0} y={0} width={width} height={height} fill={`url(#${id('navy')})`} />
        <Rect x={0} y={0} width={width} height={height} fill={`url(#${id('magenta')})`} />
        <Rect x={0} y={0} width={width} height={height} fill={`url(#${id('hlWarm')})`} />
        <Rect x={0} y={0} width={width} height={height} fill={`url(#${id('hlCool')})`} />
        <Rect x={0} y={0} width={width} height={height} fill={`url(#${id('hlViolet')})`} />
      </Svg>
    </View>
  );
}
