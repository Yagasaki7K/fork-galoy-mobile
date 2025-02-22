import React, { useState } from "react"
import ContentLoader, { Rect } from "react-content-loader/native"
import { Pressable, View } from "react-native"

import { gql } from "@apollo/client"
import {
  useHideBalanceQuery,
  useWalletOverviewScreenQuery,
  WalletCurrency,
} from "@app/graphql/generated"
import { useIsAuthed } from "@app/graphql/is-authed-context"
import { useDisplayCurrency } from "@app/hooks/use-display-currency"
import { toBtcMoneyAmount, toUsdMoneyAmount } from "@app/types/amounts"
import { makeStyles, Text, useTheme } from "@rneui/themed"

import { GaloyCurrencyBubble } from "../atomic/galoy-currency-bubble"
import { GaloyIconButton } from "../atomic/galoy-icon-button"
import { GaloyIcon } from "../atomic/galoy-icon"
import HideableArea from "../hideable-area/hideable-area"

const Loader = () => {
  const styles = useStyles()
  return (
    <View style={styles.loaderContainer}>
      <ContentLoader
        height={45}
        width={"60%"}
        speed={1.2}
        backgroundColor={styles.loaderBackground.color}
        foregroundColor={styles.loaderForefound.color}
      >
        <Rect x="0" y="0" rx="4" ry="4" width="100%" height="100%" />
      </ContentLoader>
    </View>
  )
}

gql`
  query walletOverviewScreen {
    me {
      id
      defaultAccount {
        id
        btcWallet @client {
          id
          balance
        }
        usdWallet @client {
          id
          balance
        }
      }
    }
  }
`

type Props = {
  loading: boolean
  setIsStablesatModalVisible: (value: boolean) => void
}

const WalletOverview: React.FC<Props> = ({ loading, setIsStablesatModalVisible }) => {
  const isAuthed = useIsAuthed()
  const { theme } = useTheme()
  const styles = useStyles(theme)
  const { data: { hideBalance } = {} } = useHideBalanceQuery()
  const { data } = useWalletOverviewScreenQuery({ skip: !isAuthed })
  const isBalanceVisible = hideBalance ?? false
  const [isContentVisible, setIsContentVisible] = useState(false)

  const { formatMoneyAmount, displayCurrency, moneyAmountToDisplayCurrencyString } =
    useDisplayCurrency()

  let btcInDisplayCurrencyFormatted: string | undefined = "$0.00"
  let usdInDisplayCurrencyFormatted: string | undefined = "$0.00"
  let btcInUnderlyingCurrency: string | undefined = "0 sat"
  let usdInUnderlyingCurrency: string | undefined = undefined

  if (isAuthed) {
    const btcWalletBalance = toBtcMoneyAmount(
      data?.me?.defaultAccount?.btcWallet?.balance ?? NaN,
    )

    const usdWalletBalance = toUsdMoneyAmount(
      data?.me?.defaultAccount?.usdWallet?.balance ?? NaN,
    )

    btcInDisplayCurrencyFormatted = moneyAmountToDisplayCurrencyString({
      moneyAmount: btcWalletBalance,
      isApproximate: true,
    })

    usdInDisplayCurrencyFormatted = moneyAmountToDisplayCurrencyString({
      moneyAmount: usdWalletBalance,
      isApproximate: displayCurrency !== WalletCurrency.Usd,
    })

    btcInUnderlyingCurrency = formatMoneyAmount({ moneyAmount: btcWalletBalance })

    if (displayCurrency !== WalletCurrency.Usd) {
      usdInUnderlyingCurrency = formatMoneyAmount({ moneyAmount: usdWalletBalance })
    }
  }

  const toggleIsContentVisible = () => {
    setIsContentVisible((prevState) => !prevState)
  }

  React.useEffect(() => {
    setIsContentVisible(isBalanceVisible)
  }, [isBalanceVisible])

  return (
    <View style={styles.container}>
      <View style={styles.displayTextView}>
        <Text type="p1" bold>
          My Accounts
        </Text>
        <GaloyIconButton
          name={isContentVisible ? "eye" : "eye-slash"}
          size="medium"
          onPress={toggleIsContentVisible}
        />
      </View>
      <View style={styles.separator}></View>
      <View style={styles.displayTextView}>
        <View style={styles.currency}>
          <GaloyCurrencyBubble currency="BTC" size={"medium"} />
          <Text type="p1">Bitcoin</Text>
        </View>
        {loading ? (
          <Loader />
        ) : (
          <View style={styles.hideableArea}>
            <HideableArea isContentVisible={isContentVisible}>
              <Text type="p1" bold>
                {btcInUnderlyingCurrency}
              </Text>
              <Text type="p3">{btcInDisplayCurrencyFormatted}</Text>
            </HideableArea>
          </View>
        )}
      </View>
      <View style={styles.separator}></View>
      <View style={styles.displayTextView}>
        <View style={styles.currency}>
          <GaloyCurrencyBubble currency="USD" size={"medium"} />
          <Text type="p1">Stablesats</Text>
          <Pressable onPress={() => setIsStablesatModalVisible(true)}>
            <GaloyIcon
              color={theme.colors.primary3}
              backgroundColor={theme.colors.primary9}
              name="question"
              size={15}
            />
          </Pressable>
        </View>
        {loading ? (
          <Loader />
        ) : (
          <View style={styles.hideableArea}>
            <HideableArea isContentVisible={isContentVisible}>
              {usdInUnderlyingCurrency ? (
                <Text type="p1" bold>
                  {usdInUnderlyingCurrency}
                </Text>
              ) : null}
              <Text
                type={usdInUnderlyingCurrency ? "p3" : "p1"}
                bold={!usdInUnderlyingCurrency}
              >
                {usdInDisplayCurrencyFormatted}
              </Text>
            </HideableArea>
          </View>
        )}
      </View>
    </View>
  )
}

export default WalletOverview

const useStyles = makeStyles(({ colors }) => ({
  container: {
    backgroundColor: colors.whiteOrDarkGrey,
    display: "flex",
    flexDirection: "column",
    marginHorizontal: 30,
    marginVertical: 20,
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: colors.grey9,
  },
  loaderBackground: {
    color: colors.loaderBackground,
  },
  loaderForefound: {
    color: colors.loaderForeground,
  },
  displayTextView: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  separator: {
    height: 1,
    backgroundColor: colors.lighterGreyOrBlack,
    marginVertical: 10,
  },
  currency: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
  },
  hideableArea: {
    alignItems: "flex-end",
    marginTop: 8,
    height: 35,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    height: 43,
  },
}))
