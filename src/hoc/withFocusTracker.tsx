import React, { useRef, useState, useCallback, forwardRef, useImperativeHandle } from 'react';

// Типы для пропсов, которые добавляет HOC
export interface FocusTrackerInjectedProps {
  isFocused: boolean;
  onFocusChange?: (isFocused: boolean) => void;
  onFocus?: (event: React.FocusEvent) => void;
  onBlur?: (event: React.FocusEvent) => void;
}

/**
 * HOC withFocusTracker — добавляет отслеживание фокуса к оборачиваемому компоненту.
 *
 * @param WrappedComponent - компонент, который нужно обернуть
 * @returns Новый компонент с пропсами FocusTrackerInjectedProps
 */
export function withFocusTracker<P extends object>(
  WrappedComponent: React.ComponentType<P & FocusTrackerInjectedProps>
) {
  // Сохраняем имя для отладки
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  // Создаём компонент-обёртку с использованием forwardRef для проброса ref
  const FocusTracker = forwardRef<HTMLElement, P>((props, ref) => {
      const {
        onFocusChange,
        onFocus: onFocusProp,
        onBlur: onBlurProp,
        ...restProps
      } = props as any;

      // Состояние фокуса
      const [isFocused, setIsFocused] = useState(false);

      // Ссылка на DOM-элемент, на котором отслеживаем фокус
      const containerRef = useRef<HTMLElement>(null);

      // Пробрасываем ref наружу через forwardRef
      useImperativeHandle(ref, () => containerRef.current as HTMLElement);

      // Обработчик фокуса
      const handleFocus = useCallback((event: React.FocusEvent) => {
        setIsFocused(true);
        onFocusChange?.(true);
        onFocusProp?.(event);
      }, [onFocusChange, onFocusProp]);

      // Обработчик потери фокуса
      const handleBlur = useCallback((event: React.FocusEvent) => {
        setIsFocused(false);
        onFocusChange?.(false);
        onBlurProp?.(event);
      }, [onFocusChange, onBlurProp]);

      // Подписка на события (для случаев, когда фокус может измениться без событий, например, через программный фокус)

      // Рендерим обёрнутый компонент внутри контейнера, на котором висят обработчики
      // Чтобы события всплывали от дочерних элементов, контейнер должен быть focusable.
      // Добавляем tabIndex={-1}, чтобы контейнер мог получать фокус, но не участвовал в Tab-навигации.
      return (
        <div
          ref={containerRef as React.Ref<HTMLDivElement>}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={{ display: 'contents' }} // чтобы не влиять на вёрстку
          tabIndex={-1}
        >
          <WrappedComponent
            {...(restProps as P)}
            isFocused={isFocused}
            onFocusChange={onFocusChange}
            onFocus={onFocusProp}
            onBlur={onBlurProp}
          />
        </div>
      );
    }
  );

  FocusTracker.displayName = `withFocusTracker(${displayName})`;

  return FocusTracker;
}