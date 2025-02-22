import { makeStyles, Text, useTheme } from "@rneui/themed"
import React from "react"
import { Pressable, PressableProps, StyleProp, View, ViewStyle } from "react-native"

export type GaloyTertiaryButtonProps = {
  outline?: boolean
  containerStyle?: StyleProp<ViewStyle>
  title: string
  icon?: JSX.Element
} & PressableProps

export const GaloyTertiaryButton = (props: GaloyTertiaryButtonProps) => {
  const { outline, containerStyle, disabled, icon, ...remainingProps } = props
  const styles = useStyles(props)
  const { theme } = useTheme()
  const pressableStyle = ({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => {
    let dynamicStyle
    switch (true) {
      case pressed && outline:
        dynamicStyle = {
          borderColor: theme.colors.primary,
          backgroundColor: theme.colors.primary8,
          borderWidth: 1.5,
        }
        break
      case pressed && !outline:
        dynamicStyle = {
          backgroundColor: theme.colors.primary8,
        }
        break
      case outline:
        dynamicStyle = {
          backgroundColor: "transparent",
          borderColor: disabled ? theme.colors.primary6 : theme.colors.primary,
          borderWidth: 1.5,
        }
        break
      default:
        dynamicStyle = {
          backgroundColor: theme.colors.primary9,
        }
    }

    const disabledStyle = disabled ? { opacity: 0.7 } : {}

    const sizingStyle = {
      paddingHorizontal: 16,
      paddingVertical: 4,
      borderRadius: 50,
    }

    return [sizingStyle, disabledStyle, dynamicStyle, containerStyle]
  }

  return (
    <Pressable {...remainingProps} style={pressableStyle} disabled={disabled}>
      <View style={styles.container}>
        <Text style={styles.buttonTitleStyle}>{props.title}</Text>
        {icon ? icon : null}
      </View>
    </Pressable>
  )
}

const useStyles = makeStyles((theme, props: GaloyTertiaryButtonProps) => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonTitleStyle: {
    lineHeight: 32,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.primary,
    opacity: props.disabled ? 0.7 : 1,
  },
}))
