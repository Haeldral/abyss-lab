/** @jsxImportSource theme-ui */
import { Box, Heading, Flex } from '@theme-ui/components'
import { NextPageContext } from 'next'
import { useRouter } from 'next/router'
import { pick } from 'ramda'
import { useMemo } from 'react'
import PageLink from '../../../components/atoms/PageLink'
import StigmataCard from '../../../components/molecules/StigmataCard'
import StigmataSetCard from '../../../components/molecules/StigmataSetCard'
import Breadcrumb from '../../../components/organisms/Breadcrumb'
import { StigmataData, StigmataSet } from '../../../lib/honkai3rd/stigmata'
import { getI18NProps } from '../../../server/i18n'
import {
  listStigmata,
  listStigmataSet,
} from '../../../server/data/honkai3rd/stigmata'
import { useTranslation } from 'next-i18next'
import Head from '../../../components/atoms/Head'
import Honkai3rdLayout from '../../../components/layouts/Honkai3rdLayout'

interface StigmataListPageProps {
  stigmataDataList: Pick<StigmataData, 'id' | 'name' | 'rarity'>[]
  stigmataSetList: Pick<StigmataSet, 'id' | 'name' | 'rarity'>[]
}

const StigmataListPage = ({
  stigmataDataList,
  stigmataSetList,
}: StigmataListPageProps) => {
  const { t } = useTranslation()
  const { query } = useRouter()

  const listMode = useMemo(() => {
    if (query.list == null) {
      return 'set'
    }
    return typeof query.list === 'string' ? query.list : query.list[0]
  }, [query])

  return (
    <Honkai3rdLayout>
      <Head
        title={`${t('common.stigmata')} - ${t('common.honkai-3rd')} - ${t(
          'common.abyss-lab'
        )}`}
        description={t('stigmata-list.description')}
        canonicalHref={`/honkai3rd/stigmata`}
      />

      <Box p={3}>
        <Breadcrumb
          items={[
            { href: '/honkai3rd', label: t('common.honkai-3rd') },
            { href: '/honkai3rd/stigmata', label: t('common.stigmata') },
          ]}
        />

        <Heading as='h1'>{t('stigmata-list.stigmata')}</Heading>

        <Flex mb={3}>
          <PageLink
            href={{
              query: listMode === 'set' ? { list: 'single' } : { list: 'set' },
            }}
            shallow={true}
            m={1}
            py={1}
            px={2}
            className={listMode === 'set' ? 'active' : ''}
            sx={{ display: 'flex' }}
            variant='buttons.primary'
          >
            {t('stigmata-list.set-list')}
          </PageLink>
        </Flex>

        <Flex
          sx={{
            flexWrap: 'wrap',
            justifyContent: 'space-around',
          }}
        >
          {listMode === 'set'
            ? stigmataSetList.map((stigmataSet) => {
                return (
                  <StigmataSetCard
                    key={stigmataSet.id}
                    stigmataSet={stigmataSet}
                  />
                )
              })
            : stigmataDataList.map((stigmata) => {
                return <StigmataCard key={stigmata.id} stigmata={stigmata} />
              })}
        </Flex>
      </Box>
    </Honkai3rdLayout>
  )
}

export default StigmataListPage

export async function getStaticProps({ locale }: NextPageContext) {
  return {
    props: {
      stigmataDataList: listStigmata(locale).map((stigmata) =>
        pick(['id', 'name', 'rarity'], stigmata)
      ),
      stigmataSetList: listStigmataSet(locale).map((stigmataSet) =>
        pick(['id', 'name', 'rarity'], stigmataSet)
      ),
      ...(await getI18NProps(locale)),
    },
  }
}
